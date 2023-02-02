import React, { useState } from "react";
import openailogo from "./img/openai.png";
import { Oval } from "react-loader-spinner";

const App = () => {

  // ==== Type ====
  type Error = {
    status: boolean,
    msg: string,
    type: string
  };

  // ==== State ====
  const [error, setError] = useState<Error>({
    status: false,
    msg: "",
    type: ""  
  });

  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const [loading, setLoading] = useState<boolean>(false);

  // ==== Handle ====
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const acutalData: {
          prompt: FormDataEntryValue | null,
          size: FormDataEntryValue | null
      } = {
          prompt: data.get('prompt'),
          size: data.get('size')
      };

      if (acutalData.prompt) {
          generateImageRequest(acutalData.prompt, acutalData.size);
      } else {
        setError({
            status: true,
            msg: "Please add some text...",
            type: "error" 
        })
      }
  };

  // ==== Generated Image Request ====
  const generateImageRequest = async (prompt: FormDataEntryValue | null, size: FormDataEntryValue | null) => {
    try {
      setLoading(true);

      const response = await fetch('https://ai-image-generator-server.vercel.app/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          size
        })
      });

      if (!response.ok) {
        setLoading(false);

        throw new Error('That image could not be generated!');
      }

      const data = await response.json();
      const imgUrl = data.data;
      setImageUrl(imgUrl);

      setLoading(false);
    } catch(err) {
      setError({
        status: true,
        msg: `${err}`,
        type: "error" 
      })
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFFFD]">
      <div className="max-w-4xl mx-auto space-y-4 md:my-10 my-6">
        <h2 className="text-center font-bold text-2xl">
          🤖 AI Image Generator
        </h2>
        <div className="ml-20">
          <p className="text-sm font-semibold flex flex-wrap items-center gap-3">
            📃Read 👉 <a href="https://platform.openai.com/docs/introduction" target="_blank" className="flex items-center gap-1 transition duration-300 hover:text-blue-600 hover:underline">
              <img 
                src={openailogo} 
                alt="OpenAI Logo" 
                loading="lazy" 
              />
              OpenAI API Doc
            </a>
          </p>
        </div>
      </div>

      {/* ==== Form ==== */}
      <div className="max-w-xl mx-auto my-4 bg-[#F4FFF9] sm:shadow w-full rounded-[12px] py-10 sm:px-6 px-4">
        <form 
            className="flex flex-col items-center gap-y-8 w-full"
            onSubmit={handleSubmit}
        >
            <h2 className="text-center font-bold sm:text-3xl text-2xl">
                ⌨️ Describe An Image
            </h2>
            <div className="w-full space-y-4">
                <input 
                    type="text"
                    name="prompt"
                    id="prompt"
                    placeholder="Enter your text"
                    className="w-full rounded-lg p-2.5 border-2 border-gray-400 bg-[#FDFFFD] focus:outline-none focus:border-[#043f20]"
                />
                <div className="flex items-center gap-4">
                    <span> Size: </span>
                    <select name="size" id="size" className="border border-gray-400 rounded-lg p-2 max-w-[8rem] w-full">
                        <option value="small">Small</option>
                        <option defaultChecked value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>
            <button 
                type="submit" 
                className="my-8 text-lg font-semibold bg-[#353434] hover:bg-black hover:shadow-lg text-white px-4 py-2.5 rounded-lg transition duration-300 hover:translate-y-[-2px]"
            >
                Generated Image 🖱️
            </button>
        </form> 
      </div>

      <div className="mx-auto my-4">
        <div className="flex flex-col items-center justify-center">
          {loading ? <Oval
            height={80}
            width={80}
            color="#94a3b8"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#cbd5e1"
            strokeWidth={2}
            strokeWidthSecondary={2}

          /> : imageUrl !== undefined ? 
          <img 
            src={imageUrl} 
            alt="AI Generated Image" 
          /> : error.status && <div className={`py-4 px-5 rounded-lg ${error.type === 'error' && "bg-red-100"} text-gray-800`}>
            {error.type === 'error' && "🔴"} {error.msg}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default App;
