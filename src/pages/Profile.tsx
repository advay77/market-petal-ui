import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "John Doe",
    email: user.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced e-commerce professional with over 5 years in marketplace management.",
    company: user.role === 'partner-admin' ? 'TechnoGear Solutions' : 'Lovable Market',
    website: "https://example.com",
    timezone: "PST",
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account details
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {formData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{formData.name}</h2>
                <p className="text-muted-foreground">{formData.email}</p>
                <Badge className="bg-gradient-primary">
                  {user.role === 'main-admin' ? 'Main Admin' : 'Partner Admin'}
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{formData.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="business">Business Info</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {user.role === 'partner-admin' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">125</div>
                          <div className="text-sm text-muted-foreground">Products</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">$45,230</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">4.8</div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}