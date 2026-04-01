import { Bus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RedFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="gradient-hero p-2 rounded-xl">
                <Bus className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-gradient">RedBus Elite</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('hero.tagline')}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">{t('common.quickLinks')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/bus-tickets" className="block hover:text-foreground">{t('nav.busTickets')}</Link>
              <Link to="/railways" className="block hover:text-foreground">{t('nav.trainTickets')}</Link>
              <Link to="/stories" className="block hover:text-foreground">{t('nav.stories')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">{t('common.support')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>support@redbusexpress.com</p>
              <p>+91-1800-000-0000</p>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">{t('common.followUs')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Twitter</p>
              <p>Instagram</p>
              <p>Facebook</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RedBus Elite Express. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
