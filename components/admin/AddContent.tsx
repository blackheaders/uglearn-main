"use client";
import { useEffect, useState } from "react";
// import { AddNotionMetadata } from './AddNotionMetadata';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useSetRecoilState } from "recoil";
import { atom } from "recoil";
import UploadPopup from "../UploadPopup";

export const trigger = atom<number>({
  key: "trigger",
  default: 0,
});

export const AddContent = ({
  rest,
  courseId,
  parentContentId,
  courseTitle,
  gdlink,
}: {
  rest: any;
  courseId: string;
  parentContentId?: string;
  courseTitle: string | undefined;
  gdlink?: string | null;
}) => {
  const [type, setType] = useState("folder");
  const [imageUri, setImageUri] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const setTrigger = useSetRecoilState(trigger);
  const [newgdlink, setNewgdlink] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [uploadField, setUploadField] = useState<
    "imageUrl" | "videoUrl" | null
  >(null);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const getLabelClassName = (value: string) => {
    return `flex gap-1 p-4 rounded-lg items-center space-x-2 ${
      type === value ? "border-[3px] border-blue-500" : "border-[3px]"
    }`;
  };

  const handleUploadSuccess = (url: string) => {
    if (uploadField) {
      if (uploadField === "imageUrl") {
        setImageUri(url);
      } else if (uploadField === "videoUrl") {
        setVideoUrl(url);
      }
      setIsUploadPopupOpen(false);
    }
  };

  const handleContentSubmit = async () => {
    setLoading(true);

    if (gdlink) {

      const response = await fetch("/api/admin/content/gdlink", {
        body: JSON.stringify({
          courseId,
          gdlink: newgdlink,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        toast.success(responseData.message);
        setNewgdlink(""); // Reset after success
      } else {
        toast.error(responseData.message || "Something went wrong");
      }
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/content", {
      body: JSON.stringify({
        type,
        thumbnail: imageUri,
        title,
        courseId,
        parentContentId,
        videoUrl,
        pdfUrl,
        courseTitle,
        rest,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    setLoading(false);
    if (response.status === 200 || response.status === 201) {
      // handle success if needed
      toast.success(responseData.message);
      setVideoUrl("");
      setPdfUrl("");
      setImageUri("");
      setTitle("");      
      setTrigger((prev) => prev + 1); // why? trigger a re-render, this is a hack
    } else {
      // handle error if needed
      toast.error(responseData.message || "Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border-2 p-6 lg:grid-cols-7">
      <aside className="col-span-1 flex w-full flex-col gap-8 lg:col-span-3">
        <div>
          {gdlink ? "Change Google drive Link" : "Select the Content Mode"}
        </div>

        {!gdlink && (
          <RadioGroup
            className="flex max-w-full flex-wrap items-start gap-2"
            value={type}
            onValueChange={(value) => {
              setType(value);
            }}>
            <Label htmlFor="video" className={getLabelClassName("video")}>
              <RadioGroupItem value="video" id="video" />
              <span>Video</span>
            </Label>
            <Label htmlFor="folder" className={getLabelClassName("folder")}>
              <RadioGroupItem value="folder" id="folder" />
              <span>Folder</span>
            </Label>
            <Label htmlFor="pdf" className={getLabelClassName("pdf")}>
              <RadioGroupItem value="pdf" id="pdf" />
              <span>PDF</span>
            </Label>
          </RadioGroup>
        )}
      </aside>

      <div className="col-span-1 grid grid-cols-1 gap-4 lg:col-span-4">
        {gdlink ? (
          <ChangeGDLink newgdlink={newgdlink} setNewgdlink={setNewgdlink} />
        ) : (
          <>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14"
            />
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Image URL"
                value={imageUri}
                onChange={(e) => setImageUri(e.target.value)}
                className="h-12 flex-1"
              />
              <Button
                onClick={() => {
                  setUploadField("imageUrl");
                  setIsUploadPopupOpen(true);
                }}
                type="button">
                Upload
              </Button>
            </div>
          </>
        )}
        {type === "video" && (
          <AddVideoMetadata
            setVideoUrl={setVideoUrl}
            videoUrl={videoUrl}
            setUploadField={(field) =>
              setUploadField(field as "imageUrl" | "videoUrl" | null)
            }
            setIsUploadPopupOpen={setIsUploadPopupOpen}
          />
        )}
        {type === "pdf" && <AddPDFMetadata pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />}

        <Button
          onClick={handleContentSubmit}
          disabled={loading}
          className="w-fit">
          {loading ? "Submitting" : "Submit"}
        </Button>
      </div>
      {isUploadPopupOpen && (
        <UploadPopup
          onSuccess={handleUploadSuccess}
          onClose={() => setIsUploadPopupOpen(false)}
        />
      )}
    </div>
  );
};

function AddPDFMetadata({ pdfUrl, setPdfUrl }: { pdfUrl: string; setPdfUrl: (url: string) => void }) {
  return (
    <div>
      <Input
        type="text"
        placeholder="PDF URL"
        onChange={ (e) => {
           setPdfUrl(e.target.value);
        }}
        className="h-14"
      />
    </div>
  );
}

function AddVideoMetadata(
  {videoUrl, setVideoUrl, setUploadField, setIsUploadPopupOpen}: {
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    setUploadField: (field: string) => void;
    setIsUploadPopupOpen: (open: boolean) => void;
  }
) {
  return (
    <div className="flex gap-4">
      <Input
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="h-12 flex-1"
      />
      <Button
        onClick={() => {
          setUploadField("videoUrl");
          setIsUploadPopupOpen(true);
        }}
        type="button">
        Upload
      </Button>
    </div>
  );
}

function ChangeGDLink({
  setNewgdlink,
  newgdlink,
}: {
  newgdlink: string;
  setNewgdlink: (link: string) => void;
}) {
  return (
    <div>
      <Input
        type="text"
        value={newgdlink}
        placeholder="Google Drive Link"
        onChange={(e) => setNewgdlink(e.target.value)}
        className="h-14"
      />
    </div>
  );
}
