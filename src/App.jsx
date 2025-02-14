import { useEffect, useState } from 'react';
import { TonConnect } from '@tonconnect/sdk';

export default function ClickerGame() {
    const [score, setScore] = useState(0);
    const [tg, setTg] = useState(null);
    const [tonConnect, setTonConnect] = useState(null);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            setTg(window.Telegram.WebApp);
            window.Telegram.WebApp.expand();
        }

        const tonConnectInstance = new TonConnect({
            manifestUrl: '/tonconnect-manifest.json'
        });

        setTonConnect(tonConnectInstance);

        tonConnectInstance.onStatusChange((walletInfo) => {
            if (walletInfo && walletInfo.account) {
                setWallet(walletInfo.account);
            } else {
                setWallet(null);
            }
        });
    }, []);

    const connectWallet = async () => {
        if (!tonConnect) return;

        try {
            const telegramAppUrl = 'https://t.me/wallet?start';
            window.open(telegramAppUrl, '_blank');
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };

    const disconnectWallet = () => {
        if (tonConnect) {
            tonConnect.disconnect();
            setWallet(null);
        }
    };

    const handleClick = () => {
        setScore(score + 1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
            {wallet ? (
                <div className="mt-4">
                    <p className="text-lg">Connected: {wallet.address}</p>
                    <button 
                        onClick={disconnectWallet} 
                        className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg">
                        Disconnect
                    </button>
                </div>
            ) : (
                <button 
                    onClick={connectWallet} 
                    className="mt-4 px-6 py-3 text-lg bg-green-500 hover:bg-green-700 rounded-lg">
                    Connect Telegram Wallet
                </button>
            )}

            <h1 className="text-3xl font-bold mb-6">TON Clicker</h1>
            <p className="text-xl mb-6">Score: {score}</p>
            <button 
                onClick={handleClick} 
                className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-700 rounded-lg shadow-md transition-all">
                Click Me!
            </button>
        </div>
    );
}
