import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Brain, Zap } from 'lucide-react';

const TransferLearningApp = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setFile(uploadedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const processTransferLearning = async () => {
    if (!file) {
      setError('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulasi proses transfer learning
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResults = {
      model: 'MobileNetV2',
      predictions: [
        { class: 'Golden Retriever', confidence: 0.94 },
        { class: 'Labrador Retriever', confidence: 0.03 },
        { class: 'Cocker Spaniel', confidence: 0.02 }
      ],
      processingTime: '2.8s',
      imageSize: `${file.size / 1024}KB`,
      timestamp: new Date().toLocaleString('id-ID')
    };

    setResults(mockResults);
    setIsProcessing(false);
  };

  const downloadPDF = () => {
    if (!results) return;

    const pdfContent = `
LAPORAN HASIL TRANSFER LEARNING
================================

Model: ${results.model}
Waktu Proses: ${results.processingTime}
Ukuran Gambar: ${results.imageSize}
Timestamp: ${results.timestamp}

HASIL PREDIKSI:
---------------
${results.predictions.map((pred, idx) => 
  `${idx + 1}. ${pred.class}: ${(pred.confidence * 100).toFixed(2)}%`
).join('\n')}

Catatan: Hasil ini menggunakan model pre-trained yang telah di-fine-tune
menggunakan teknik Transfer Learning.
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfer-learning-results-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Transfer Learning Studio
              </h1>
              <p className="text-gray-600 text-sm">AI-Powered Image Classification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Upload className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Upload Image</h2>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-purple-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
            >
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                  <p className="text-sm text-gray-600 font-medium">{file.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="w-16 h-16 text-purple-400 mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-gray-700">Click to upload image</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={processTransferLearning}
              disabled={!file || isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Start Transfer Learning</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Results</h2>
            </div>

            {!results && !isProcessing && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center space-y-4">
                  <Brain className="w-20 h-20 mx-auto opacity-30" />
                  <p className="text-lg">Upload an image and start processing to see results</p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
                  <p className="text-lg text-gray-700 font-medium">Analyzing image with Transfer Learning...</p>
                  <p className="text-sm text-gray-500">This may take a few seconds</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Model</p>
                      <p className="text-gray-900 font-bold text-lg">{results.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Processing Time</p>
                      <p className="text-gray-900 font-bold text-lg">{results.processingTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Image Size</p>
                      <p className="text-gray-900 font-bold text-lg">{results.imageSize}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Timestamp</p>
                      <p className="text-gray-900 font-bold text-sm">{results.timestamp}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Predictions</h3>
                  <div className="space-y-3">
                    {results.predictions.map((pred, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">{pred.class}</span>
                          <span className="text-purple-600 font-bold">{(pred.confidence * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={downloadPDF}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Report (TXT)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pre-trained Models</h3>
            <p className="text-gray-600 text-sm">Using state-of-the-art deep learning models trained on millions of images</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">Get accurate predictions in seconds with optimized inference pipeline</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Export Results</h3>
            <p className="text-gray-600 text-sm">Download detailed reports of your predictions for documentation</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Transfer Learning Studio. Powered by Deep Learning & AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransferLearningApp;