import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreManagement } from '@/hooks/useReduxStoreManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Store, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormErrors {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { loading, error },
    actions: { }
  } = useStoreManagement();

  // const [formData, setFormData] = useState<CreateStoreForm>({
  //   name: '',
  //   is_active: true,
  //   metadata: {
  //     address: '',
  //     phone: '',
  //     email: '',
  //     description: ''
  //   }
  // });

  const [formErrors] = useState<FormErrors>({});
  const [isSubmitting] = useState(false);

  // const validateForm = (): boolean => {
  //   const errors: FormErrors = {};

  //   // Name validation
  //   if (!formData.name.trim()) {
  //     errors.name = 'Store name is required';
  //   } else if (formData.name.trim().length < 2) {
  //     errors.name = 'Store name must be at least 2 characters long';
  //   }

  //   // Address validation (optional but if provided, should be valid)
  //   if (formData.metadata?.address && formData.metadata.address.trim().length < 5) {
  //     errors.address = 'Address must be at least 5 characters long';
  //   }

  //   // Phone validation (optional but if provided, should be valid)
  //   if (formData.metadata?.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,}$/.test(formData.metadata.phone)) {
  //     errors.phone = 'Please enter a valid phone number';
  //   }

  //   // Email validation (optional but if provided, should be valid)
  //   if (formData.metadata?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.metadata.email)) {
  //     errors.email = 'Please enter a valid email address';
  //   }

  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleInputChange = (field: keyof CreateStoreForm, value: any) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
    
  //   // Clear error for this field
  //   if (formErrors[field as keyof FormErrors]) {
  //     setFormErrors(prev => ({
  //       ...prev,
  //       [field]: undefined
  //     }));
  //   }
  // };

  // const handleMetadataChange = (field: string, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     metadata: {
  //       ...prev.metadata,
  //       [field]: value
  //     }
  //   }));
    
  //   // Clear error for this field
  //   if (formErrors[field as keyof FormErrors]) {
  //     setFormErrors(prev => ({
  //       ...prev,
  //       [field]: undefined
  //     }));
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);
    
  //   try {
  //     // const result = await createStore(formData);
  //     // if (result.meta.requestStatus === 'fulfilled') {
  //       navigate('/store-management');
  //     // }
  //   } catch (err) {
  //     console.error('Failed to create store:', err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link to="/store-management" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store Management
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Create New Store
          </CardTitle>
          <CardDescription>
            Add a new store location to your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  type="text"
                  
                  placeholder="Enter store name"
                  className={formErrors.name ? 'border-destructive' : ''}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  // checked={formData.is_active}
                  // onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active Store</Label>
              </div>
            </div>

            {/* Store Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Store Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  // value={formData.metadata?.address || ''}
                  // onChange={(e) => handleMetadataChange('address', e.target.value)}
                  placeholder="Enter store address"
                  className={formErrors.address ? 'border-destructive' : ''}
                  rows={3}
                />
                {formErrors.address && (
                  <p className="text-sm text-destructive">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    // value={formData.metadata?.phone || ''}
                    // onChange={(e) => handleMetadataChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className={formErrors.phone ? 'border-destructive' : ''}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-destructive">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    // value={formData.metadata?.email || ''}
                    // onChange={(e) => handleMetadataChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={formErrors.email ? 'border-destructive' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  // value={formData.metadata?.description || ''}
                  // onChange={(e) => handleMetadataChange('description', e.target.value)}
                  placeholder="Enter store description (optional)"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1"
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-4 w-4" />
                    Create Store
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/store-management')}
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStore;