"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Circle,
  Download,
  Eraser,
  Grab,
  Pen,
  Save,
  Square,
  Type,
} from "lucide-react";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/ui/mode";
import Link from "next/link";
import { Canvas, PencilBrush, Circle as FCircle, Textbox, Rect } from "fabric";

const Page = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (!canvasRef.current) return;
    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    newCanvas.setWidth(window.innerWidth - 100);
    newCanvas.setHeight(window.innerHeight - 100);
    newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
    newCanvas.freeDrawingBrush.color = "#000000";
    newCanvas.freeDrawingBrush.width = 3;
    newCanvas.renderAll();
    setCanvas(newCanvas);
  }, []);

  useEffect(() => {
    if (!canvas) return;

    if (tool === "pen") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 3;
    } else {
      canvas.isDrawingMode = false;
      canvas.forEachObject((obj) => (obj.selectable = true)); // Enable selection
    }

    canvas.requestRenderAll();
  }, [tool, color, canvas]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on("path:created", () => {
      canvas.renderAll();
    });
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.setWidth(window.innerWidth - 100);
      canvas.setHeight(window.innerHeight - 100);
      canvas.renderAll();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [canvas]);

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: color,
      stroke: "black",
      strokeWidth: 2,
      width: 100,
      height: 100,
      selectable: true,
      evented: true,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new FCircle({
      left: 100,
      top: 100,
      fill: color,
      stroke: "black",
      strokeWidth: 2,
      radius: 50,
      selectable: true,
      evented: true,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addText = () => {
    if (!canvas) return;
    const text = new Textbox("Write here...", {
      left: 50,
      top: 50,
      width: 200,
      fontSize: 20,
      fill: color,
      editable: true,
      selectable: true,
      evented: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
  };

  const saveSketch = () => {
    if (!canvas) return;
    localStorage.setItem("sketch", JSON.stringify(canvas.toJSON()));
    toast.success("Sketch saved!");
  };

  const downloadSketch = () => {
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "sketch.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid place-items-center gap-4 py-4">
      <div className={`flex justify-between w-full px-20`}>
        <div>
          <Link href="/dashboard">
            <Button variant="">
              <ArrowLeft /> Back
            </Button>
          </Link>
        </div>
        <div className="flex gap-4">
          <Button
            variant={tool === "pen" ? "default" : "outline"}
            size="icon"
            title="Pen"
            onClick={() => setTool("pen")}
          >
            <Pen />
          </Button>
          <Button
            variant={tool === "Selection" ? "default" : "outline"}
            size="icon"
            title="Select"
            onClick={() => setTool("Selection")}
          >
            <Grab />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Square"
            onClick={addRectangle}
          >
            <Square />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Circle"
            onClick={addCircle}
          >
            <Circle />
          </Button>
          <Button variant="outline" size="icon" title="Text" onClick={addText}>
            <Type />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Clear All"
            onClick={clearCanvas}
          >
            <Eraser />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Save"
            onClick={saveSketch}
          >
            <Save />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="Download"
            onClick={downloadSketch}
          >
            <Download />
          </Button>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-lg border-none"
        />
      </div>
      <div className="grid place-items-center">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "500px" }}
          className="rounded-lg mx-auto border"
        />
      </div>
    </div>
  );
};

export default Page;
