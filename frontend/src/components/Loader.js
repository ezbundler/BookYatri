import { motion } from "framer-motion";

import loaderImage from "../images/bus5.png";
import TypeWriterEffect from "./TypeWriterComponent";


const LoaderModal = () => {
  const colors = ["text-red-600", "text-yellow-500"];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-70">
      <motion.img
        src={loaderImage}
        alt="Loading"
        className="w-48 h-48 mb-4"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div className={`text-2xl font-bold`}>
       <TypeWriterEffect/>
      </motion.div>
    </div>
  );
};

export default LoaderModal;
