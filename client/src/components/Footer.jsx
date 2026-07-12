export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold mb-2">ShopBD</h3>
          <p>আপনার বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম।</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <p>About · Contact · FAQ · Privacy Policy</p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-2">Support</h3>
          <p>support@shopbd.com</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-800">
        © {new Date().getFullYear()} ShopBD. All rights reserved.
      </div>
    </footer>
  );
}
