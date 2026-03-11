export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border mt-12">
      <div className="max-w-layout mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-sm font-bold text-t1 mb-3">Support</p>
            <ul className="flex flex-col gap-2">
              {['Help Centre', 'Safety information', 'Cancellation options', 'Report a neighbourhood concern'].map(item => (
                <li key={item}><a href="#" className="text-sm text-t2 hover:underline">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-t1 mb-3">Community</p>
            <ul className="flex flex-col gap-2">
              {['Host Living\'s anti-discrimination policy', 'Combating discrimination', 'Report an accessibility issue'].map(item => (
                <li key={item}><a href="#" className="text-sm text-t2 hover:underline">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-t1 mb-3">Hosting</p>
            <ul className="flex flex-col gap-2">
              {['Host your home', 'Host an experience', 'Host responsibly', 'Resource Centre'].map(item => (
                <li key={item}><a href="#" className="text-sm text-t2 hover:underline">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-t3">© 2024 Host Living, Inc. · Privacy · Terms · Sitemap</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-t3">English (HK)</span>
            <span className="text-xs text-t3">HK$ HKD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
