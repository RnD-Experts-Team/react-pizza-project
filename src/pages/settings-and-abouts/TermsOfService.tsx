import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { ScrollText, Calendar, Shield, AlertTriangle } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 ">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <ScrollText className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Terms of Service
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-lg px-2 sm:px-0">
          Please read these terms carefully before using our pizza ordering
          service.
        </p>
        <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Acceptance of Terms */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl text-card-foreground">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              By accessing and using Pizza Portal, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Pizza Portal is an online platform that allows users to browse,
              customize, and order pizzas for delivery or pickup. Our service
              includes:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
              <li>Online pizza ordering and customization</li>
              <li>Real-time order tracking</li>
              <li>Payment processing</li>
              <li>Customer account management</li>
              <li>Delivery and pickup coordination</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              As a user of our service, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
              <li>
                Provide accurate and complete information when placing orders
              </li>
              <li>Use the service only for lawful purposes</li>
              <li>Maintain the security of your account credentials</li>
              <li>Pay for all orders placed through your account</li>
              <li>Respect our staff and delivery personnel</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">4. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Payment is required at the time of order placement. We accept
              major credit cards, debit cards, and digital payment methods. All
              prices are subject to change without notice. Taxes and delivery
              fees may apply.
            </p>
            <div className="bg-destructive/5 dark:bg-destructive/10 p-3 sm:p-4 rounded-lg border border-destructive/20">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mr-2 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-destructive">
                    Refund Policy
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Refunds are available for cancelled orders before
                    preparation begins. Contact customer service within 30
                    minutes of order placement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Terms */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">5. Delivery Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Delivery times are estimates and may vary based on location,
              weather, and order volume. We are not responsible for delays
              beyond our control. Delivery is available within our designated
              service areas only.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Pizza Portal shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </p>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">7. Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the service, to understand our
              practices.
            </p>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">8. Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              the service constitutes acceptance of the modified terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">9. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <p className="font-medium text-foreground text-sm sm:text-base">Pizza Portal Support</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Email: legal@pizzaportal.com
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">Phone: 1-800-PIZZA-01</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Address: 123 Pizza Street, Food City, FC 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="text-center text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
        <p>
          By using Pizza Portal, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
