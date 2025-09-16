import { useState } from "react";
import { FileText, Plus, Upload, Eye, Edit, Trash2, Search, Grid, List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTemplates, Template } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";

export default function Templates() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const isMainAdmin = user.role === 'main-admin';

  const filteredTemplates = mockTemplates.filter(template => {
    if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && template.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
          <Badge variant={template.isActive ? "default" : "secondary"}>
            {template.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Category: {template.category}</span>
          <span>{template.usageCount} uses</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Updated: {formatDate(template.updatedAt)}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          {isMainAdmin && (
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Manage storefront templates and layouts'
              : 'Browse available storefront templates'
            }
          </p>
        </div>
        {isMainAdmin && (
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Storefront">Storefront</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Checkout">Checkout</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {template.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.usageCount}</TableCell>
                  <TableCell>{formatDate(template.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {isMainAdmin && (
                        <>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first template.'}
            </p>
            {isMainAdmin && (
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}