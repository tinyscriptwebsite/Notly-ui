/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Circle,
  Download,
  Eraser,
  Grab,
  Pen,
  Redo,
  Save,
  Square,
  Type,
  Undo,
} from "lucide-react";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/ui/mode";
import Link from "next/link";
import { Canvas, PencilBrush, Circle as FCircle, Textbox, Rect } from "fabric";
import { useTheme } from "next-themes";
import { saveNotebook } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Page = () => {
  const canvasRef = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();
  const [canvas, setCanvas] = useState(null);
  const [title, setTitle] = useState("untitled");
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const saveCanvasState = () => {
    if (!canvas) return;
    const currentState = canvas.toJSON();
    setHistory((prevHistory) => [...prevHistory, currentState]);
    setRedoHistory([]); // Clear redo history when a new action is performed
  };

  useEffect(() => {
    if (theme === "dark") {
      setColor(theme === "dark" ? "#ffffff" : "#000000");
    }
    if (!canvasRef.current) return;
    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    newCanvas.setWidth(window.innerWidth - 100);
    newCanvas.setHeight(window.innerHeight - 100);
    newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
    newCanvas.freeDrawingBrush.color = color;
    newCanvas.freeDrawingBrush.width = 3;
    newCanvas.renderAll();
    setCanvas(newCanvas);
    return () => {
      newCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    if (tool === "pen") {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = 3;
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
      canvas.forEachObject((obj) => (obj.selectable = true)); // Enable selection
    }
    canvas.requestRenderAll();
  }, [tool, color, canvas]);

  useEffect(() => {
    if (!canvas) return;

    const handlePathCreated = () => {
      canvas.renderAll(); // Ensure the canvas is re-rendered immediately
      saveCanvasState(); // Save the canvas state
    };

    canvas.on("path:created", handlePathCreated);

    // Cleanup the event listener when the component unmounts
    return () => {
      canvas.off("path:created", handlePathCreated);
    };
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

  const addRectangle = useCallback(() => {
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
    setTool("Selection");
    canvas.add(rect);
    canvas.setActiveObject(rect);
    saveCanvasState();
  }, [canvas, color]);

  const addCircle = useCallback(() => {
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
    setTool("Selection");
    canvas.add(circle);
    canvas.setActiveObject(circle);
    saveCanvasState();
  }, [canvas, color]);

  const addText = useCallback(() => {
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
    setTool("Selection");
    canvas.add(text);
    canvas.setActiveObject(text);
    saveCanvasState();
  }, [canvas, color]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    saveCanvasState();
  }, [canvas]);

  const saveSketch = async () => {
    try {
      if (!canvas) return;
      const { data } = await saveNotebook({
        type: "sketch",
        title: title,
        content: canvas.toJSON(),
      });
      if (data.success) {
        toast.success("Sketch saved!");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadSketch = (type) => {
    if (!canvas) return;

    const link = document.createElement("a");
    if (type === "png") {
      const dataURL = canvas.toDataURL({
        format: "pdf",
        quality: 1.0,
      });
      link.href = dataURL;
      link.download = "sketch.png";
    } else {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const canvasDataURL = canvas.toDataURL("image/png");

      const imgWidth = 297;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;

      pdf.addImage(canvasDataURL, "PNG", 10, 10, imgWidth - 20, imgHeight);

      pdf.save("sketch.pdf"); // Download PDF file
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const undo = () => {
    if (history.length === 0 || !canvas) return;

    const lastState = history[history.length - 1]; // Get last saved state
    setHistory((prev) => prev.slice(0, -1)); // Remove last state from history
    setRedoHistory((prev) => [lastState, ...prev]); // Push last state to redo stack

    if (history.length > 1) {
      canvas.loadFromJSON(history[history.length - 2], () => {
        canvas.renderAll();
      });
    } else {
      canvas.clear();
    }
    setTool(tool === "Selection" ? "pen" : "Selection");
  };

  const redo = () => {
    if (redoHistory.length === 0 || !canvas) return;

    const nextState = redoHistory[0]; // Get last redo state
    setRedoHistory((prev) => prev.slice(1)); // Remove from redo stack
    setHistory((prev) => [...prev, nextState]); // Push to history stack

    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
    });
    setTool(tool === "Selection" ? "pen" : "Selection");
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
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            title="Erase"
            onClick={() => {
              setTool("eraser");
              clearCanvas();
            }}
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
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size="icon" title="Download">
                  <Download />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <DropdownMenuItem
                  onClick={() => downloadSketch("png")}
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                >
                  PNG
                </DropdownMenuItem>
                <DropdownMenuSeparator></DropdownMenuSeparator>
                <DropdownMenuItem
                  onClick={() => downloadSketch("pdf")}
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                >
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-around items-center w-full">
        <div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              title="Undo"
              onClick={undo}
              disabled={history.length === 0}
            >
              <Undo />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Redo"
              onClick={redo}
              disabled={redoHistory.length === 0}
            >
              <Redo />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold">Title:</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
