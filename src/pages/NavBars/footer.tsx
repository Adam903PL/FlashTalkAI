


export const Footer = () => {

    return(
        <footer className="mt-16 bg-gray-800 py-8">
<div className="container mx-auto text-center text-gray-300">
  <p className="text-sm mb-4">© 2025 <span className="font-semibold">FlashTalkAI</span>. All rights reserved.</p>
  <p className="text-sm mb-4">Founded by <span className="font-semibold">Adam Pukaluk</span></p>
  
  <div className="flex justify-center gap-6 mb-6">
    {/* Instagram Link */}
    <a
      href="https://www.instagram.com/yourprofile" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-purple-500 transition-colors"
    >
      <i className="fab fa-instagram text-xl"></i>
    </a>
    {/* Facebook Link */}
    <a
      href="https://www.facebook.com/yourprofile" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-blue-600 transition-colors"
    >
      <i className="fab fa-facebook text-xl"></i>
    </a>
    {/* Twitter Link */}
    <a
      href="https://twitter.com/yourprofile" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-300 hover:text-blue-400 transition-colors"
    >
      <i className="fab fa-twitter text-xl"></i>
    </a>
  </div>
  
  <p className="text-xs text-gray-400">Crafted with 💙 using React and Tailwind CSS</p>
</div>
</footer>

    )
    
}