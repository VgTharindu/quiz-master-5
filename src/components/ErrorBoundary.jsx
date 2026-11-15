import { Component } from "react";

// Catches failed lazy-chunk loads (e.g. when offline) and offers a reload instead of a blank screen.
// Error boundaries can only be class components.
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
