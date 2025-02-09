/* eslint-disable react-hooks/exhaustive-deps */
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
  Trash,
  Type,
} from "lucide-react";
import toast from "react-hot-toast";
import { ModeToggle } from "@/components/ui/mode";
import Link from "next/link";
import { Canvas, PencilBrush, Circle as FCircle, Textbox, Rect } from "fabric";
import { useTheme } from "next-themes";
import {
  saveNotebook,
  getNotebook,
  updateNotebook,
  deleteNotebook,
} from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const Page = () => {
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [title, setTitle] = useState("untitled");

  const { theme } = useTheme();
  const { id } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (theme === "dark") {
      setColor("#ffffff");
    }
  }, [theme]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("Canvas Ref is not initialized");
      return;
    }

    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    if (!newCanvas) {
      console.error("Fabric canvas is not initialized properly.");
      return;
    }

    canvasInstance.current = newCanvas;
    setCanvas(newCanvas);

    newCanvas.setWidth(window.innerWidth - 100);
    newCanvas.setHeight(window.innerHeight - 100);
    newCanvas.freeDrawingBrush = new PencilBrush(newCanvas);
    newCanvas.freeDrawingBrush.color = color;
    newCanvas.freeDrawingBrush.width = 3;
    newCanvas.renderAll();

    fetchSketch(newCanvas);

    return () => {
      console.log("Canvas is null");
      if (newCanvas === null) {
        return;
      } else {
        newCanvas.dispose();
        canvasInstance.current = null;
        setCanvas(null);
      }
    };
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
      canvas.forEachObject((obj) => (obj.selectable = true));
    }

    canvas.requestRenderAll();

    return () => {
      canvas.isDrawingMode = false;
      canvas.forEachObject((obj) => (obj.selectable = false));
    };
  }, [tool, color, canvas]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on("path:created", () => {
      canvas.renderAll();
    });

    return () => {
      canvas.off("path:created");
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

  const fetchSketch = async (newCanvas) => {
    try {
      const { data } = await getNotebook(id);
      if (data && data.data.content) {
        newCanvas.loadFromJSON(data.data.content, () => {
          newCanvas.renderAll();
        });
        setTool("Selection");
        setTitle(data.data.title);
      }
    } catch (error) {
      console.error("Failed to load sketch:", error);
    }
  };

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: color,
      width: 100,
      height: 100,
      selectable: true,
      evented: true,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);

    canvas.on("object:modified", () => {
      canvas.renderAll();
    });
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new FCircle({
      left: 100,
      top: 100,
      fill: color,
      radius: 50,
      selectable: true,
      evented: true,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);

    canvas.on("object:modified", () => {
      canvas.renderAll();
    });
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

    canvas.on("object:modified", () => {
      canvas.renderAll();
    });
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
  };

  const saveSketch = async () => {
    try {
      if (!canvas) return;
      const { data } = await updateNotebook(id, {
        id: id,
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

  const deleteSketch = async () => {
    try {
      const { data } = await deleteNotebook(id);
      if (data.success) {
        toast.success("Sketch deleted!");
        router.push("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
            title="clear canvas"
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
          <Button
            variant="outline"
            size="icon"
            title="Download"
            onClick={downloadSketch}
          >
            <Download />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Delete"
            onClick={deleteSketch}
          >
            <Trash />
          </Button>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-around items-center w-full">
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
        <canvas ref={canvasRef} className="rounded-lg mx-auto border" />
      </div>
    </div>
  );
};

export default Page;
