import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const onMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === 'BUTTON' || 
                (e.target as HTMLElement).tagName === 'A' || 
                (e.target as HTMLElement).onclick ||
                (e.target as HTMLElement).closest('.clickable')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const onMouseDown = () => setIsMouseDown(true);
        const onMouseUp = () => setIsMouseDown(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: isHovering ? '60px' : '30px',
                height: isHovering ? '60px' : '30px',
                border: '1px solid var(--primary)',
                borderRadius: '50%',
                pointerEvents: 'none',
                transform: `translate(${position.x - (isHovering ? 30 : 15)}px, ${position.y - (isHovering ? 30 : 15)}px) scale(${isMouseDown ? 0.8 : 1})`,
                transition: 'width 0.3s, height 0.3s, transform 0.1s ease-out, background 0.3s',
                background: isHovering ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '4px',
                    height: '4px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px var(--primary-glow)'
                }} />
            </div>
            <style>{`
                body { cursor: none !important; }
                button, a, input, select, textarea { cursor: none !important; }
            `}</style>
        </>
    );
};

export default CustomCursor;
