function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full border-animated-container flex overflow-hidden">
      {children}
    </div>
  );
}
export default BorderAnimatedContainer;