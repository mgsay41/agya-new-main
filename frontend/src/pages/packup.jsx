import { CiSearch } from "react-icons/ci";
import { useEffect, useState, useContext } from "react";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
import RichTextWithTranslate from "../components/richText"
import { GlobalContext } from "../context/GlobelContext";

import { FaFile } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import Navbar from "../components/Navbar";

export default function NewArtical() {
  const { setIsAuthUser, isAuthUser } = useContext(GlobalContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTage] = useState([]);
  const [references, setReferences] = useState([]);
  const [image, setImages] = useState("");               //feature image not exist in the article model
  const [editorValue,setEditorValue]=useState("");
  const [existTags, setExistTage] = useState(null);      // no tags model exist in schema

  useEffect(() => {
    setIsAuthUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [setIsAuthUser]);

  const handleExtractData = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorValue, "text/html");
    setTitle(doc.querySelector("h1, p")?.innerText || "No Title");
    setContent(doc.body.innerText);
    setImages(doc.querySelector("img")?.src || "No Image");

  };

  async function createArticle() {
    try {
      const articleData = {
        title: title,
        content: content,
        authorId: isAuthUser.id, // Example MongoDB ObjectId
        tags: tags,
        references: references
      };

      const response = await fetch("http://localhost:4000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create article");
      }

      const newArticle = await response.json();
      console.log("Article created successfully:", newArticle);
    } catch (error) {
      console.error("Error creating article:", error.message);
    }
  }


  return (
    <div className="px-[150px] ">
      <Navbar />
      <form className="articale">
        <div className="mt-8">
          {/* <div className=" border ">
            <div className=" border-b py-2 px-4 flex justify-center items-center">
              <Select
                value={age}
                onChange={handleChange}
                 className=" mx-4"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  None
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <button>B</button>
            </div>
            <div>
                <textarea className=" w-full h-auto relative re outline-none p-2" placeholder='Title 
                  subtitle                
                ' ></textarea>
            </div>
          </div> */}
          <div>
          <RichTextWithTranslate onEditorChange={(value) => setEditorValue(value)} />
          </div>
          <h3 className=" font-semibold my-5">Featured Image</h3>
          <div className=" flex flex-col ">
            <div>
              <input
                type="radio"
                className=" accent-main w-[15px] h-[15px]"
                id=""
                name="feat-input"
              />
              <label htmlFor=""> Use first image as featured image</label>
            </div>
            <div>
              <input
                type="radio"
                className=" accent-main w-[15px] h-[15px]"
                name="feat-input"
              />
              <label htmlFor=""> Upload another image</label>
            </div>
          </div>
          <div className="tages">
            <h3 className="font-semibold my-5">Article Tags</h3>
            <div className=" flex h-[10px] items-center relative mb-[10px]">
              <CiSearch className=" absolute top-[-9px] left-1 w-[25px] " />
              <input
                type="text"
                className=" bg-[#e6e6d7] border-0 w-1/2 px-[40px] h-[30px] mb-[10px] rounded-[5px] "
              />
            </div>
            <div className="flex gap-[10px]">
              <div className=" border border-solid py-[6px] px-[10px] border-main mt-[10px] rounded-[5px] ">
                tag1
              </div>
              <div className=" border border-solid py-[6px] px-[10px] border-main mt-[10px] rounded-[5px] ">
                tag1
              </div>
              <div className=" border border-solid py-[6px] px-[10px] border-main mt-[10px] rounded-[5px] ">
                tag1
              </div>
              <div className=" border border-solid py-[6px] px-[10px] border-main mt-[10px] rounded-[5px] ">
                tag1
              </div>
            </div>
            <div>
              <h3 className=" font-semibold my-5">Tags</h3>
              <div className=" flex gap-[10px]">
                <div className=" bg-main text-white font-light py-[6px] px-[10px] rounded-[5px]">
                  tag1
                </div>
                <div className=" bg-main text-white font-light py-[6px] px-[10px] rounded-[5px]">
                  tag1
                </div>
                <div className=" bg-main text-white font-light py-[6px] px-[10px] rounded-[5px]">
                  tag1
                </div>
                <div className=" bg-main text-white font-light py-[6px] px-[10px] rounded-[5px]">
                  tag1
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold my-5">Article References</h3>
              <div className=" flex flex-col w-full ">
                <div className=" w-full relative">
                  <input
                    type="text"
                    className=" mb-5 h-[35px] border py-[2px] px-[5px] border-[#e6e6d7] w-full"
                    placeholder="Sources, bibliography, links, book titles"
                  />
                  <IoMdAdd className="  absolute right-0 bg-main text-white w-[25px] h-[25px] rounded-[5px] top-[6px] py-[2px] px-[8px]  " />
                </div>
                <div className="flex items-center gap-[5px] w-full ">
                  <FaFile className="text-main" />
                  <p className=" text-main w-full text-[14px] underline">
                    https://agya.info/agya-life/key-activities/exhibition-opening-in-berlin-cinderella-sindbad-sinuhe-arab-german-storytelling-traditions-1-1
                  </p>
                  <IoTrashBinOutline />
                </div>
                <div className="flex items-center gap-[5px] w-full">
                  <FaFile className="text-main" />
                  <p className=" text-main w-full text-[14px] underline">
                    https://agya.info/agya-life/key-activities/exhibition-opening-in-berlin-cinderella-sindbad-sinuhe-arab-german-storytelling-traditions-1-1
                  </p>
                  <IoTrashBinOutline />
                </div>
                <div className="flex items-center gap-[5px] w-full">
                  <FaFile className="text-main" />
                  <p className=" text-main w-full text-[14px] underline">
                    https://agya.info/agya-life/key-activities/exhibition-opening-in-berlin-cinderella-sindbad-sinuhe-arab-german-storytelling-traditions-1-1
                  </p>
                  <IoTrashBinOutline />
                </div>
                <div className="flex items-center gap-[5px] w-full">
                  <FaFile className="text-main" />
                  <p className=" text-main w-full text-[14px] underline">
                    https://agya.info/agya-life/key-activities/exhibition-opening-in-berlin-cinderella-sindbad-sinuhe-arab-german-storytelling-traditions-1-1
                  </p>
                  <IoTrashBinOutline />
                </div>
              </div>
            </div>
            <div className=" submit-articale">
              <h4 className="mt-5">
                By submitting this article, I certify that:
              </h4>
              <ol start={"1"}>
                <li>
                  Content Accuracy: The content is based on credible evidence
                  and research.
                </li>
                <li>
                  Asset Ownership: I own the copyright to all uploaded assets or
                  have obtained necessary permissions.
                </li>
                <li>
                  Consent to Use: I grant [Platform Name] a non-exclusive,
                  worldwide, royalty-free license to reproduce, distribute,
                  display, and perform the uploaded assets.
                </li>
              </ol>
              <div className="flex gap-[5px]  ">
                <input type="checkbox" className=" accent-main w-[15px]" />
                <p className="text-[13px]">
                  I understand that providing false or misleading information or
                  unauthorized assets may result in the removal of my article
                  and potential consequences.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button className=" bg-main text-white py-[12px] px-[100px] rounded-[5px] my-8"
            onClick={() => {
              handleExtractData(); // Extract data
              createArticle(); // Create article
            }}
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
