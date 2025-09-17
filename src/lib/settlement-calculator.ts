import { Product, Order } from './mock-data';

// Settlement configuration
export const SETTLEMENT_CONFIG = {
  PAYMENT_GATEWAY_FEE_PERCENTAGE: 2.9, // 2.9% PG fee
  PAYMENT_GATEWAY_FIXED_FEE: 0.30, // $0.30 fixed fee per transaction
  SETTLEMENT_DAY: 31, // Last day of month
  AUTO_EMAIL_ENABLED: true,
};

export interface SettlementCalculation {
  partnerId: string;
  partnerName: string;
  period: string;
  totalSales: number;
  mainProductSales: number;
  partnerProductSales: number;
  mainProductMargin: number;
  partnerProductRevenue: number;
  grossEarnings: number;
  paymentGatewayFees: number;
  netSettlementAmount: number;
  transactionCount: number;
  breakdown: SettlementBreakdown[];
}

export interface SettlementBreakdown {
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productType: 'main-supplied' | 'partner-uploaded';
  sellingPrice: number;
  wholesaleCost?: number; // Only for main products
  partnerEarning: number;
  pgFees: number;
  date: string;
}

export interface MonthlySettlementSummary {
  month: string;
  year: number;
  totalPartners: number;
  totalSettlements: number;
  totalAmount: number;
  totalPGFees: number;
  settlements: SettlementCalculation[];
}

/**
 * Calculate settlement for a specific partner for a given period
 */
export function calculatePartnerSettlement(
  partnerId: string,
  partnerName: string,
  orders: Order[],
  products: Product[],
  period: string
): SettlementCalculation {
  // Filter orders for this partner in the given period
  const partnerOrders = orders.filter(order => 
    order.partnerId === partnerId &&
    isOrderInPeriod(order.createdAt, period)
  );

  const breakdown: SettlementBreakdown[] = [];
  let mainProductSales = 0;
  let partnerProductSales = 0;
  let mainProductMargin = 0;
  let partnerProductRevenue = 0;
  let totalPGFees = 0;

  partnerOrders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      const itemTotal = item.price * item.quantity;
      const itemPGFee = calculatePGFees(itemTotal);
      totalPGFees += itemPGFee;

      let partnerEarning = 0;

      if (product.type === 'main-supplied') {
        // Main Products: Selling Price – Wholesale Cost = Partner Margin
        const marginPerUnit = item.price - product.wholesaleCost;
        partnerEarning = marginPerUnit * item.quantity;
        mainProductSales += itemTotal;
        mainProductMargin += partnerEarning;
      } else {
        // Partner Products: 100% of sales revenue belongs to the Partner
        partnerEarning = itemTotal;
        partnerProductSales += itemTotal;
        partnerProductRevenue += partnerEarning;
      }

      breakdown.push({
        orderId: order.id,
        orderNumber: order.orderNumber,
        productId: product.id,
        productName: product.name,
        productType: product.type,
        sellingPrice: itemTotal,
        wholesaleCost: product.type === 'main-supplied' ? product.wholesaleCost * item.quantity : undefined,
        partnerEarning: partnerEarning,
        pgFees: itemPGFee,
        date: order.createdAt,
      });
    });
  });

  const totalSales = mainProductSales + partnerProductSales;
  const grossEarnings = mainProductMargin + partnerProductRevenue;
  const netSettlementAmount = grossEarnings - totalPGFees;

  return {
    partnerId,
    partnerName,
    period,
    totalSales,
    mainProductSales,
    partnerProductSales,
    mainProductMargin,
    partnerProductRevenue,
    grossEarnings,
    paymentGatewayFees: totalPGFees,
    netSettlementAmount: Math.max(0, netSettlementAmount), // Ensure non-negative
    transactionCount: partnerOrders.length,
    breakdown,
  };
}

/**
 * Calculate monthly settlements for all partners
 */
export function calculateMonthlySettlements(
  orders: Order[],
  products: Product[],
  partners: any[],
  month: number,
  year: number
): MonthlySettlementSummary {
  const period = `${getMonthName(month)} ${year}`;
  const settlements: SettlementCalculation[] = [];

  partners.forEach(partner => {
    const settlement = calculatePartnerSettlement(
      partner.id,
      partner.name,
      orders,
      products,
      period
    );

    // Only include partners with actual sales
    if (settlement.totalSales > 0) {
      settlements.push(settlement);
    }
  });

  const totalAmount = settlements.reduce((sum, s) => sum + s.netSettlementAmount, 0);
  const totalPGFees = settlements.reduce((sum, s) => sum + s.paymentGatewayFees, 0);

  return {
    month: period,
    year,
    totalPartners: settlements.length,
    totalSettlements: settlements.length,
    totalAmount,
    totalPGFees,
    settlements,
  };
}

/**
 * Calculate payment gateway fees for a transaction
 */
export function calculatePGFees(amount: number): number {
  const percentageFee = amount * (SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FEE_PERCENTAGE / 100);
  const totalFee = percentageFee + SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FIXED_FEE;
  return Math.round(totalFee * 100) / 100; // Round to 2 decimal places
}

/**
 * Check if an order falls within a specific period
 */
function isOrderInPeriod(orderDate: string, period: string): boolean {
  // Simple period matching - in real app, this would be more sophisticated
  const orderMonth = new Date(orderDate);
  const [monthName, year] = period.split(' ');
  const periodMonth = new Date(`${monthName} 1, ${year}`);
  
  return orderMonth.getMonth() === periodMonth.getMonth() && 
         orderMonth.getFullYear() === periodMonth.getFullYear();
}

/**
 * Get month name from number
 */
function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
}

/**
 * Generate settlement report data for email
 */
export function generateSettlementReport(settlement: SettlementCalculation): {
  summary: any;
  breakdown: any[];
  emailContent: string;
} {
  const summary = {
    partner: settlement.partnerName,
    period: settlement.period,
    totalSales: settlement.totalSales,
    grossEarnings: settlement.grossEarnings,
    pgFees: settlement.paymentGatewayFees,
    netAmount: settlement.netSettlementAmount,
    transactionCount: settlement.transactionCount,
  };

  const breakdown = settlement.breakdown.map(item => ({
    order: item.orderNumber,
    product: item.productName,
    type: item.productType,
    sales: item.sellingPrice,
    earning: item.partnerEarning,
    pgFee: item.pgFees,
    date: item.date,
  }));

  const emailContent = `
    Settlement Report - ${settlement.period}
    
    Dear ${settlement.partnerName},
    
    Your monthly settlement has been processed for ${settlement.period}.
    
    SUMMARY:
    • Total Sales: $${settlement.totalSales.toFixed(2)}
    • Gross Earnings: $${settlement.grossEarnings.toFixed(2)}
    • Payment Gateway Fees: $${settlement.paymentGatewayFees.toFixed(2)}
    • Net Settlement Amount: $${settlement.netSettlementAmount.toFixed(2)}
    • Total Transactions: ${settlement.transactionCount}
    
    BREAKDOWN:
    • Main Product Sales: $${settlement.mainProductSales.toFixed(2)}
    • Main Product Margins: $${settlement.mainProductMargin.toFixed(2)}
    • Partner Product Sales: $${settlement.partnerProductSales.toFixed(2)}
    • Partner Product Revenue: $${settlement.partnerProductRevenue.toFixed(2)}
    
    The settlement amount will be deposited to your registered bank account within 3-5 business days.
    
    For any queries, please contact our support team.
    
    Best regards,
    Lovable Market Team
  `;

  return { summary, breakdown, emailContent };
}

/**
 * Simulate automated monthly settlement process
 */
export function processMonthlySettlements(
  orders: Order[],
  products: Product[],
  partners: any[]
): {
  processedSettlements: SettlementCalculation[];
  emailReports: { partnerId: string; report: any }[];
  summary: MonthlySettlementSummary;
} {
  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  
  const summary = calculateMonthlySettlements(orders, products, partners, lastMonth + 1, year);
  
  const emailReports = summary.settlements.map(settlement => ({
    partnerId: settlement.partnerId,
    report: generateSettlementReport(settlement),
  }));

  return {
    processedSettlements: summary.settlements,
    emailReports,
    summary,
  };
}
