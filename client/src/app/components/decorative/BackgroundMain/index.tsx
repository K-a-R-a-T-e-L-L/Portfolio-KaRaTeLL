import { useGetSizingWindow } from "@/hooks/useGetSizingWindow/useGetSizingWindow";
import { useCallback, useEffect, useRef } from "react";

const BackgroundMain = () => {
    const RefCanvas = useRef<HTMLCanvasElement | null>(null);
    const [Width, Height] = useGetSizingWindow();

    const NumPoints = Math.floor((Width / 100) * 5);

    const Points = Array.from({ length: NumPoints }, () => ({
        x: Math.random() * Width,
        y: Math.random() * Height,
        radius: 1.5 / (Math.random() + 0.2),
        dx: (Math.random() - 0.5) * 1.2,
        dy: (Math.random() - 0.5) * 1.2,
    }));

    const PathRender = useCallback((ctx: CanvasRenderingContext2D) => {
        for (let i = 0; i < NumPoints; i++) {
            for (let j = i + 1; j < NumPoints; j++) {
                const dist = Math.hypot(Points[j].x - Points[i].x, Points[j].y - Points[i].y);
                if (dist <= 150) {
                    ctx.beginPath();
                    ctx.moveTo(Points[i].x, Points[i].y);
                    ctx.lineTo(Points[j].x, Points[j].y);
                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                };
            };
        };
    }, [NumPoints, Points]);

    const PointsRendering = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, Width, Height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, Width, Height);

        Points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.fill();
            ctx.closePath();

            point.x += point.dx;
            point.y += point.dy;

            if (point.x < 0 || point.x > Width) point.dx *= -1;
            if (point.y < 0 || point.y > Height) point.dy *= -1;
        });

        PathRender(ctx);
    }, [Height, Width, Points, PathRender]);

    useEffect(() => {
        const Canvas = RefCanvas.current;
        const ctx = Canvas?.getContext('2d');
        if (!ctx) return;

        const handleAnimation = () => {
            PointsRendering(ctx);
            requestAnimationFrame(handleAnimation);
        };
        handleAnimation();

    }, [Width, Height, PointsRendering]);

    return (
        <>
            <canvas
                width={Width}
                height={Height}
                ref={RefCanvas}
                style={{ position: 'absolute', zIndex: -1 }}
            />
        </>
    );
};

export default BackgroundMain;

