import React from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Routes from './routes/Routes';

function App() {
    return (
        <div className="App">
            <header className="navbar-container">
                <Navbar />
            </header>

            <Routes />

            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    );
}

export default App;
