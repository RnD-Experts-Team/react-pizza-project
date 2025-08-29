import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Shield, Eye, Lock, Database, Calendar, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg px-4 sm:px-0">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
        <div className="flex items-center justify-center mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
        {/* Information We Collect */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl text-card-foreground">
              <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We collect information you provide directly to us, such as when
              you create an account, place an order, or contact us for support.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Personal Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery address and billing information</li>
                  <li>Payment method details (processed securely)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                  Automatically Collected Information:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl text-card-foreground">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We use the information we collect to provide, maintain, and
              improve our services:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
              <li>Process and fulfill your pizza orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send promotional offers and updates (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties except in the following
              circumstances:
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div className="bg-primary/5 dark:bg-primary/10 p-3 sm:p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                  Service Providers:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  We share information with trusted third-party service
                  providers who help us operate our business, such as payment
                  processors, delivery services, and cloud hosting providers.
                </p>
              </div>

              <div className="bg-destructive/5 dark:bg-destructive/10 p-3 sm:p-4 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2 text-sm sm:text-base">
                  Legal Requirements:
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  We may disclose information when required by law, court order,
                  or government request, or to protect our rights and safety.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl text-card-foreground">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              4. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-muted-foreground ml-3 sm:ml-4 text-sm sm:text-base">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and employee training</li>
              <li>Payment card industry (PCI) compliance</li>
            </ul>
            <div className="bg-destructive/5 dark:bg-destructive/10 p-3 sm:p-4 rounded-lg border border-destructive/20 mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong className="text-destructive">Important:</strong> While we strive to protect your
                information, no method of transmission over the internet or
                electronic storage is 100% secure. We cannot guarantee absolute
                security.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">5. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              You have several rights regarding your personal information:
            </p>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Access & Update
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    View and update your account information anytime
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Delete Account
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Request deletion of your account and data
                  </p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Marketing Opt-out
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Unsubscribe from promotional emails
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Data Portability
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Request a copy of your data
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">6. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We use cookies and similar technologies to enhance your
              experience:
            </p>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Essential Cookies
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Required for basic website functionality
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Analytics Cookies
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Help us understand how you use our website
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm sm:text-base">
                    Marketing Cookies
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Used to show relevant advertisements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">7. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us
              immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-card-foreground">8. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-lg sm:text-xl text-card-foreground">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              9. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <p className="font-medium text-foreground text-sm sm:text-base">Privacy Officer - Pizza Portal</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Email: privacy@pizzaportal.com
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">Phone: 1-800-PRIVACY</p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Address: 123 Pizza Street, Food City, FC 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div className="text-center text-xs sm:text-sm text-muted-foreground">
        <p>
          By using Pizza Portal, you consent to the collection and use of your
          information as described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
