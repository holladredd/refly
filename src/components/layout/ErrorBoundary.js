import React from "react";
import Swal from "sweetalert2";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);

    // Automatically trigger sweet alert on component crashes
    Swal.fire({
      icon: "error",
      title: "Application Error",
      text:
        error?.message ||
        "An unexpected rendering error occurred in the workspace.",
      background: "#1f2937",
      color: "#f3f4f6",
      confirmButtonColor: "#3b82f6",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6 text-center">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-red-500">
              Something went wrong
            </h2>
            <p className="text-gray-400 text-sm">
              The application encountered an unexpected interface rendering
              error.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
