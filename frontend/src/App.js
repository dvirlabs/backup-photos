import './App.css';
import PhotosList from './components/PhotosList';
import PhotoUploader from './components/PhotoUploader';

function App() {
  const handleUploadComplete = () => {
    // Force the PhotosList component to refresh
    // This is a simple way to refresh the gallery after upload
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold mb-6">Photo Gallery</h1>
        <div className="max-w-xl w-full mx-auto mb-8">
          <PhotoUploader onUploadComplete={handleUploadComplete} />
        </div>
        <PhotosList />
      </header>
    </div>
  );
}

export default App;