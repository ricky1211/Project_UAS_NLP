import React, { useState, useRef } from 'react';
import { Upload, Download, Loader2, CheckCircle, AlertCircle, Brain, FileText, BarChart3, PieChart, TrendingUp, File, Image } from 'lucide-react';

const NLPTransferLearningApp = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [textContent, setTextContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    return { headers, rows, text: lines.join(' ') };
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setTextContent('');
    setImagePreview('');

    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    
    try {
      if (fileExtension === 'txt') {
        setFileType('text');
        const content = await readTextFile(uploadedFile);
        setTextContent(content);
      } 
      else if (fileExtension === 'csv') {
        setFileType('csv');
        const content = await readTextFile(uploadedFile);
        const parsed = parseCSV(content);
        setTextContent(parsed.text);
      }
      else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFileType('excel');
        // Simulasi - dalam production gunakan library seperti xlsx
        setTextContent('Excel file detected. Content will be processed...');
      }
      else if (uploadedFile.type.startsWith('image/')) {
        setFileType('image');
        const imageData = await readImageFile(uploadedFile);
        setImagePreview(imageData);
        setTextContent('Image uploaded for OCR and visual analysis...');
      }
      else {
        setError('Unsupported file format. Please upload TXT, CSV, XLSX, or Image files');
        setFile(null);
      }
    } catch (err) {
      setError('Error reading file: ' + err.message);
      setFile(null);
    }
  };

  const calculateStatistics = (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    const wordFreq = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanWord) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    return {
      totalWords: words.length,
      totalSentences: sentences.length,
      totalCharacters: characters,
      totalCharactersNoSpaces: charactersNoSpaces,
      avgWordLength: words.length > 0 ? (charactersNoSpaces / words.length).toFixed(2) : 0,
      avgSentenceLength: sentences.length > 0 ? (words.length / sentences.length).toFixed(2) : 0,
      topWords
    };
  };

  const processNLP = async () => {
    if (!textContent && !imagePreview) {
      setError('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 3500));

    const stats = textContent ? calculateStatistics(textContent) : null;

    let mockResults;

    if (fileType === 'image') {
      mockResults = {
        model: 'Vision Transformer + BERT (Multi-modal Transfer Learning)',
        task: 'Image Classification, OCR & Visual Text Analysis',
        predictions: [
          { category: 'Image Category: Document', confidence: 0.89, color: 'bg-blue-500' },
          { category: 'Text Detection: Yes', confidence: 0.95, color: 'bg-green-500' },
          { category: 'Quality: High', confidence: 0.82, color: 'bg-purple-500' }
        ],
        entities: [
          { entity: 'Objects Detected', count: 12 },
          { entity: 'Text Regions', count: 5 },
          { entity: 'Colors', count: 8 },
          { entity: 'Shapes', count: 15 }
        ],
        topics: [
          { topic: 'Visual Content', relevance: 0.92 },
          { topic: 'Document Analysis', relevance: 0.78 },
          { topic: 'Text Recognition', relevance: 0.85 }
        ],
        imageAnalysis: {
          dimensions: '1920x1080',
          format: file.type.split('/')[1].toUpperCase(),
          dominantColors: ['#2C3E50', '#3498DB', '#ECF0F1']
        },
        processingTime: '3.5s',
        timestamp: new Date().toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } else {
      mockResults = {
        model: 'BERT-Base (Transfer Learning)',
        task: 'Sentiment Analysis, NER & Text Classification',
        predictions: [
          { category: 'Positive Sentiment', confidence: 0.78, color: 'bg-green-500' },
          { category: 'Neutral Sentiment', confidence: 0.15, color: 'bg-yellow-500' },
          { category: 'Negative Sentiment', confidence: 0.07, color: 'bg-red-500' }
        ],
        entities: [
          { entity: 'PERSON', count: 5 },
          { entity: 'ORGANIZATION', count: 3 },
          { entity: 'LOCATION', count: 4 },
          { entity: 'DATE', count: 2 }
        ],
        topics: [
          { topic: 'Technology', relevance: 0.85 },
          { topic: 'Business', relevance: 0.62 },
          { topic: 'Innovation', relevance: 0.54 }
        ],
        processingTime: '3.5s',
        timestamp: new Date().toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }

    setResults(mockResults);
    setStatistics(stats);
    setIsProcessing(false);
  };

  const generatePDFContent = () => {
    if (!results) return '';

    let content = `
═══════════════════════════════════════════════════════════════════
    LAPORAN HASIL ANALISIS NLP DENGAN TRANSFER LEARNING
═══════════════════════════════════════════════════════════════════

Tanggal & Waktu: ${results.timestamp}
Model: ${results.model}
Task: ${results.task}
Waktu Pemrosesan: ${results.processingTime}

───────────────────────────────────────────────────────────────────
1. INFORMASI FILE
───────────────────────────────────────────────────────────────────
Nama File: ${file.name}
Ukuran File: ${(file.size / 1024).toFixed(2)} KB
Tipe File: ${fileType.toUpperCase()}
`;

    if (fileType === 'image' && results.imageAnalysis) {
      content += `
───────────────────────────────────────────────────────────────────
2. ANALISIS GAMBAR
───────────────────────────────────────────────────────────────────
Dimensi: ${results.imageAnalysis.dimensions}
Format: ${results.imageAnalysis.format}
Warna Dominan: ${results.imageAnalysis.dominantColors.join(', ')}
`;
    }

    if (statistics) {
      content += `
───────────────────────────────────────────────────────────────────
${fileType === 'image' ? '3' : '2'}. STATISTIK TEKS
───────────────────────────────────────────────────────────────────
Total Kata: ${statistics.totalWords}
Total Kalimat: ${statistics.totalSentences}
Total Karakter: ${statistics.totalCharacters}
Total Karakter (tanpa spasi): ${statistics.totalCharactersNoSpaces}
Rata-rata Panjang Kata: ${statistics.avgWordLength} karakter
Rata-rata Panjang Kalimat: ${statistics.avgSentenceLength} kata

Top 10 Kata Paling Sering Muncul:
${statistics.topWords.map((item, idx) => `  ${idx + 1}. ${item.word}: ${item.count} kali`).join('\n')}
`;
    }

    const sectionNum = statistics ? (fileType === 'image' ? '4' : '3') : '2';
    content += `
───────────────────────────────────────────────────────────────────
${sectionNum}. ANALISIS ${fileType === 'image' ? 'VISUAL & SENTIMENT' : 'SENTIMENT'}
───────────────────────────────────────────────────────────────────
${results.predictions.map((pred, idx) => 
  `${idx + 1}. ${pred.category}: ${(pred.confidence * 100).toFixed(2)}%`
).join('\n')}

───────────────────────────────────────────────────────────────────
${parseInt(sectionNum) + 1}. ${fileType === 'image' ? 'DETEKSI OBJEK & ELEMEN' : 'NAMED ENTITY RECOGNITION (NER)'}
───────────────────────────────────────────────────────────────────
${results.entities.map((ent, idx) => 
  `${idx + 1}. ${ent.entity}: ${ent.count} ${fileType === 'image' ? 'terdeteksi' : 'entitas terdeteksi'}`
).join('\n')}

───────────────────────────────────────────────────────────────────
${parseInt(sectionNum) + 2}. TOPIC MODELING
───────────────────────────────────────────────────────────────────
${results.topics.map((topic, idx) => 
  `${idx + 1}. ${topic.topic}: ${(topic.relevance * 100).toFixed(2)}% relevansi`
).join('\n')}

───────────────────────────────────────────────────────────────────
${parseInt(sectionNum) + 3}. KESIMPULAN
───────────────────────────────────────────────────────────────────
`;

    if (fileType === 'image') {
      content += `Berdasarkan analisis menggunakan model ${results.model}, gambar yang 
dianalisis menunjukkan kategori: ${results.predictions[0].category}
dengan tingkat kepercayaan ${(results.predictions[0].confidence * 100).toFixed(2)}%.

Gambar berhasil diproses dengan deteksi ${results.entities.reduce((sum, e) => sum + e.count, 0)} 
elemen visual, dengan topik dominan: ${results.topics[0].topic}.`;
    } else {
      content += `Berdasarkan analisis menggunakan model ${results.model}, ${fileType === 'csv' ? 'data CSV' : 'teks'} yang 
dianalisis menunjukkan sentimen dominan: ${results.predictions[0].category}
dengan tingkat kepercayaan ${(results.predictions[0].confidence * 100).toFixed(2)}%.`;
      
      if (statistics) {
        content += `

Teks mengandung ${statistics.totalWords} kata dalam ${statistics.totalSentences} 
kalimat, dengan distribusi topik utama di bidang ${results.topics[0].topic}.`;
      }
    }

    content += `

═══════════════════════════════════════════════════════════════════
    © 2025 NLP Transfer Learning Studio - AI-Powered Analysis
═══════════════════════════════════════════════════════════════════
    `;

    return content;
  };

  const downloadFullReport = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NLP-Report-Full-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadStatistics = () => {
    if (!statistics) return;

    const content = `
STATISTIK TEKS - LAPORAN
========================

Total Kata: ${statistics.totalWords}
Total Kalimat: ${statistics.totalSentences}
Total Karakter: ${statistics.totalCharacters}
Total Karakter (tanpa spasi): ${statistics.totalCharactersNoSpaces}
Rata-rata Panjang Kata: ${statistics.avgWordLength} karakter
Rata-rata Panjang Kalimat: ${statistics.avgSentenceLength} kata

Top 10 Kata Paling Sering:
${statistics.topWords.map((item, idx) => `${idx + 1}. ${item.word}: ${item.count} kali`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Statistics-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'text':
        return <FileText className="w-16 h-16 text-indigo-600 mx-auto" />;
      case 'csv':
        return <BarChart3 className="w-16 h-16 text-green-600 mx-auto" />;
      case 'excel':
        return <File className="w-16 h-16 text-emerald-600 mx-auto" />;
      case 'image':
        return <Image className="w-16 h-16 text-purple-600 mx-auto" />;
      default:
        return <FileText className="w-16 h-16 text-indigo-400 mx-auto" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NLP Transfer Learning Studio
              </h1>
              <p className="text-gray-600 text-sm">Multi-format Analysis: Text, CSV, Excel & Images</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Upload className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Upload File</h2>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-dashed border-indigo-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
          >
            {file ? (
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                    <p className="text-lg font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    {getFileIcon()}
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Type: {fileType.toUpperCase()} | Size: {(file.size / 1024).toFixed(2)} KB
                      </p>
                      {textContent && (
                        <div className="mt-4 max-h-32 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 text-left">
                            {textContent.substring(0, 300)}...
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <FileText className="w-12 h-12 text-indigo-400" />
                  <BarChart3 className="w-12 h-12 text-green-400" />
                  <File className="w-12 h-12 text-emerald-400" />
                  <Image className="w-12 h-12 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-700">Click to upload file</p>
                  <p className="text-sm text-gray-500 mt-2">Support: TXT, CSV, XLSX, XLS, JPG, PNG, JPEG (max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
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
            onClick={processNLP}
            disabled={!file || isProcessing}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing {fileType.toUpperCase()} Analysis...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Analyze with Transfer Learning</span>
              </>
            )}
          </button>
        </div>

        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 mb-8">
            <div className="text-center space-y-4">
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xl text-gray-700 font-medium">
                Analyzing {fileType === 'image' ? 'image with Vision Transformer...' : 'text with BERT Transfer Learning...'}
              </p>
              <p className="text-sm text-gray-500">
                {fileType === 'image' 
                  ? 'Performing OCR, object detection, and visual analysis' 
                  : 'Performing sentiment analysis, NER, and topic modeling'}
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Statistics Section */}
            {statistics && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Text Statistics</h2>
                  </div>
                  <button
                    onClick={downloadStatistics}
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                    title="Download Statistics"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-600 font-medium">Total Words</p>
                      <p className="text-2xl font-bold text-blue-900">{statistics.totalWords}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Total Sentences</p>
                      <p className="text-2xl font-bold text-green-900">{statistics.totalSentences}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <p className="text-sm text-purple-600 font-medium">Characters</p>
                      <p className="text-2xl font-bold text-purple-900">{statistics.totalCharacters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
                      <p className="text-sm text-pink-600 font-medium">Avg Word Length</p>
                      <p className="text-2xl font-bold text-pink-900">{statistics.avgWordLength}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Top 10 Most Frequent Words</span>
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {statistics.topWords.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {idx + 1}. {item.word}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${(item.count / statistics.topWords[0].count) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-indigo-600 w-8 text-right">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NLP Results Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Model</p>
                      <p className="text-gray-900 font-bold text-sm">{results.model}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Task</p>
                      <p className="text-gray-900 font-bold">{results.task}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 font-medium">Processing Time</p>
                        <p className="text-gray-900 font-bold">{results.processingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">File Type</p>
                        <p className="text-gray-900 font-bold">{fileType.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {fileType === 'image' && results.imageAnalysis && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Image Information</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600">Dimensions</p>
                        <p className="text-sm font-bold text-gray-900">{results.imageAnalysis.dimensions}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600">Format</p>
                        <p className="text-sm font-bold text-gray-900">{results.imageAnalysis.format}</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Dominant Colors</p>
                      <div className="flex space-x-2">
                        {results.imageAnalysis.dominantColors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {fileType === 'image' ? 'Classification Results' : 'Sentiment Analysis'}
                  </h3>
                  <div className="space-y-3">
                    {results.predictions.map((pred, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">{pred.category}</span>
                          <span className="text-indigo-600 font-bold">{(pred.confidence * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`${pred.color} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {fileType === 'image' ? 'Visual Elements Detected' : 'Named Entities (NER)'}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {results.entities.map((ent, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600">{ent.entity}</p>
                        <p className="text-lg font-bold text-gray-900">{ent.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Topic Modeling</h3>
                  <div className="space-y-2">
                    {results.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-700">{topic.topic}</span>
                        <span className="text-sm font-bold text-purple-600">{(topic.relevance * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Full Report Button */}
        {results && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Complete Analysis Report</h3>
                <p className="text-sm text-gray-600 mt-1">Download comprehensive report with all statistics and analysis results</p>
              </div>
              <button
                onClick={downloadFullReport}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span>Download Full Report (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Text Files</h3>
            <p className="text-gray-600 text-sm">TXT format support</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">CSV Data</h3>
            <p className="text-gray-600 text-sm">Spreadsheet analysis</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <File className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Excel Files</h3>
            <p className="text-gray-600 text-sm">XLSX/XLS support</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Images</h3>
            <p className="text-gray-600 text-sm">OCR & visual analysis</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 NLP Transfer Learning Studio. Multi-format AI Analysis Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default NLPTransferLearningApp;