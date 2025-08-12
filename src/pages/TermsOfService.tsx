import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ScrollText, Calendar, Shield, AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ScrollText className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Please read these terms carefully before using our pizza ordering service.
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Pizza Portal, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle>2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Pizza Portal is an online platform that allows users to browse, customize, and order pizzas for delivery or pickup. 
              Our service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Online pizza ordering and customization</li>
              <li>Real-time order tracking</li>
              <li>Payment processing</li>
              <li>Customer account management</li>
              <li>Delivery and pickup coordination</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              As a user of our service, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide accurate and complete information when placing orders</li>
              <li>Use the service only for lawful purposes</li>
              <li>Maintain the security of your account credentials</li>
              <li>Pay for all orders placed through your account</li>
              <li>Respect our staff and delivery personnel</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>4. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Payment is required at the time of order placement. We accept major credit cards, debit cards, and digital payment methods. 
              All prices are subject to change without notice. Taxes and delivery fees may apply.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Refund Policy
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Refunds are available for cancelled orders before preparation begins. 
                    Contact customer service within 30 minutes of order placement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Terms */}
        <Card>
          <CardHeader>
            <CardTitle>5. Delivery Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Delivery times are estimates and may vary based on location, weather, and order volume. 
              We are not responsible for delays beyond our control. Delivery is available within our designated service areas only.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Pizza Portal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>7. Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
              to understand our practices.
            </p>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card>
          <CardHeader>
            <CardTitle>8. Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>9. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Pizza Portal Support</p>
              <p className="text-muted-foreground">Email: legal@pizzaportal.com</p>
              <p className="text-muted-foreground">Phone: 1-800-PIZZA-01</p>
              <p className="text-muted-foreground">Address: 123 Pizza Street, Food City, FC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          By using Pizza Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;