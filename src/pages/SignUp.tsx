import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { signupApi } from "@/api/auth";
import { useUser } from "@/context/UserContext";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeToUpdates: false,
  });
  
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation
      if (!formData.agreeToTerms) {
        throw new Error("Please agree to terms and conditions");
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      const [data, err] = await signupApi({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: "partner-admin",
        companyName: formData.companyName
      });
      
      if (err) {
        throw err;
      }
      
      setUser(data);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    }
    
    setIsLoading(false);
  };

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const passwordMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand Section */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-4">
            <div className="text-2xl font-bold text-primary-foreground">LM</div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Partner Registration</h1>
          <p className="text-muted-foreground mt-1">Join Lovable Market as a partner</p>
        </div> */}

        {/* Sign Up Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Partner Registration</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to register as a partner and start selling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${passwordStrength.hasLength ? 'opacity-100' : 'opacity-30'}`} />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasUppercase ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${passwordStrength.hasUppercase ? 'opacity-100' : 'opacity-30'}`} />
                        Uppercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLowercase ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${passwordStrength.hasLowercase ? 'opacity-100' : 'opacity-30'}`} />
                        Lowercase letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${passwordStrength.hasNumber ? 'opacity-100' : 'opacity-30'}`} />
                        Number
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className={`h-3 w-3 ${passwordStrength.hasSpecial ? 'opacity-100' : 'opacity-30'}`} />
                        Special character
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs ${passwordMatch ? 'text-success' : 'text-destructive'}`}>
                    {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Terms and Updates */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subscribeToUpdates"
                    checked={formData.subscribeToUpdates}
                    onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked as boolean)}
                  />
                  <Label htmlFor="subscribeToUpdates" className="text-sm font-normal">
                    Subscribe to product updates and announcements
                  </Label>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register as Partner"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>


            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2024 Lovable Market. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
