import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AuroraPainterProps {
    addAchievement: (id: string) => void;
    onBack: () => void;
}

const AuroraPainter: React.FC<AuroraPainterProps> = ({ addAchievement, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [color, setColor] = useState('#4ade80'); // green-400
    const [brushSize, setBrushSize] = useState(30);
    const [hasPainted, setHasPainted] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const getCoords = useCallback((event: MouseEvent | TouchEvent): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const touch = 'touches' in event ? event.touches[0] : null;
        return {
            x: (touch ? touch.clientX : (event as MouseEvent).clientX) - rect.left,
            y: (touch ? touch.clientY : (event as MouseEvent).clientY) - rect.top,
        };
    }, []);

    const startPainting = useCallback((event: MouseEvent | TouchEvent) => {
        const coords = getCoords(event);
        if (!coords) return;
        
        setIsPainting(true);
        lastPos.current = coords;

        if (!hasPainted) {
            setHasPainted(true);
            addAchievement('aurora-artist');
        }
    }, [getCoords, addAchievement, hasPainted]);

    const paint = useCallback((event: MouseEvent | TouchEvent) => {
        if (!isPainting) return;
        event.preventDefault();
        
        const coords = getCoords(event);
        if (!coords) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(coords.x, coords.y);
        
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.globalCompositeOperation = 'lighter';

        ctx.stroke();
        lastPos.current = coords;
    }, [isPainting, getCoords, brushSize, color]);

    const stopPainting = useCallback(() => {
        setIsPainting(false);
    }, []);

    const drawBackground = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.fillStyle = '#0c0a1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 150; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        drawBackground();

        const handleResize = () => drawBackground();
        window.addEventListener('resize', handleResize);

        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mousemove', paint);
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mouseleave', stopPainting);
        
        canvas.addEventListener('touchstart', startPainting, { passive: false });
        canvas.addEventListener('touchmove', paint, { passive: false });
        canvas.addEventListener('touchend', stopPainting);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousedown', startPainting);
            canvas.removeEventListener('mousemove', paint);
            canvas.removeEventListener('mouseup', stopPainting);
            canvas.removeEventListener('mouseleave', stopPainting);
            
            canvas.removeEventListener('touchstart', startPainting);
            canvas.removeEventListener('touchmove', paint);
            canvas.removeEventListener('touchend', stopPainting);
        };
    }, [startPainting, paint, stopPainting, drawBackground]);

    const colors = ['#4ade80', '#86efac', '#a78bfa', '#c4b5fd', '#f472b6'];

    return (
        <div className="w-full h-full p-2 sm:p-4 flex flex-col animate-fade-in">
            <div className="flex-shrink-0 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-orbitron text-xl font-bold text-center">Mission: Aurora Painter</h3>
                <div className="flex items-center gap-2 flex-wrap justify-center bg-black/30 p-2 rounded-full">
                    {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 border-transparent ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`} aria-label={`Select color ${c}`}></button>
                    ))}
                    <input type="range" min="10" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 cursor-pointer" aria-label="Adjust brush size"/>
                    <button onClick={drawBackground} className="px-3 py-1 bg-red-600/80 hover:bg-red-700 rounded-full text-xs font-semibold">Clear</button>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-sky-600/80 hover:bg-sky-700 rounded-full text-sm font-semibold transition-transform hover:scale-105">Back to Missions</button>
            </div>
            <div className="flex-grow bg-black/30 rounded-lg shadow-inner overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full cursor-crosshair"></canvas>
            </div>
        </div>
    );
};

export default AuroraPainter;
