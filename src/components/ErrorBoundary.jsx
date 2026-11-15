import { Component } from "react";

// app එකේ කොටසක් load වෙන්න බැරි වුණොත් (උදා: internet නැති වුණොත්) හිස් සුදු තිරයක් වෙනුවට
// පණිවිඩයක් සහ "නැවත උත්සාහ කරන්න" බොත්තමක් පෙන්වනවා.
// Error boundaries හදන්න පුළුවන් class component එකකින් විතරයි
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="wrap" style={{ textAlign: "center", paddingTop: 60 }}>
        <h2>සම්බන්ධතාවය දුර්වලයි</h2>
        <p>Internet සම්බන්ධතාවය පරීක්ෂා කර නැවත උත්සාහ කරන්න.</p>
        <button onClick={() => location.reload()}>නැවත උත්සාහ කරන්න</button>
      </div>
    );
  }
}
