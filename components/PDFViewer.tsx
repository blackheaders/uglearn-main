import React from 'react';

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-[calc(100vh-300px)] sm:h-[calc(100vh-200px)]">
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
        className="w-full h-full border-0 rounded-lg"
        title="PDF Viewer"
      />
    </div>
  );
}

export default PDFViewer;