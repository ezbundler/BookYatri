import { motion } from "framer-motion";

import Typewriter from "typewriter-effect";

const TypeWriterEffect = () => {


  return (
    <div className="">
      <motion.div className={`text-4xl font-bold text-yellow-400`}>
        <Typewriter
          options={{
            strings: ["Loading....."],
            autoStart: true,
            loop: true,
            delay: 100,
          }}
        />
      </motion.div>
    </div>
  );
};

export default TypeWriterEffect;
