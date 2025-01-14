
import { useEffect, useState } from "react";
import axios from 'axios';
import './Poll.css';

const Poll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonText, setButtonText] = useState('Vote');
  const [pollId, setPollId] = useState("678182af1cc542001017358f"); // It should start with the first poll ID 
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchPollData(pollId);
  }, [pollId]);

  const fetchPollData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/polls/random/`);
      const data = response.data;
      console.log(data);
      setQuestion(data.question_text);
      setOptions(data.options || []);
      console.log(data.options)
      setSelectedOption(null);
      setButtonText('Vote');
    } catch (error) {
      console.error('Error fetching poll data:', error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Set the entire option object
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (buttonText === 'Vote') {
      // Handle vote submission logic here
      console.log('User voted for:', selectedOption ? selectedOption.text : 'No option selected');
      setTotalVotes(totalVotes + 1);
      setButtonText('Next question');
    } else {
      setPollId(pollId + 1); // Increment the poll ID to fetch the next question
    }
  };

  const PollOptions = ({ option, onClick, isSelected }) => {
    return (
      <button
        className={`poll-option w-full p-2 mt-2 text-white rounded ${isSelected ? 'bg-[#7100AE]' : 'bg-gray-700'} hover:bg-[#7100AE]`}
        onClick={onClick}
        style={{ color: 'white' }} // Inline style to set text color to white
      >
        {option.text}
      </button>
    );
  };

  return (
    <form className="poll-container flex flex-col items-center p-4 max-w-xs mx-auto text-black" onSubmit={handleSubmit}>
      <div className="flex flex-col pt-4 w-full text-xl">
        <label className="self-start text-3xl text-center text-neutral-500">
          {question}
        </label>
        {options.map((option, index) => (
          <PollOptions
            key={index}
            option={option} // Pass the entire option object
            onClick={() => handleOptionClick(option)}
            isSelected={selectedOption === option} // Compare with the entire option object
          />
        ))}
      </div>
      <button
        type="submit"
        className={`gap-2.5 px-4 py-2 mt-6 max-w-full text-3xl text-center whitespace-nowrap rounded-3xl bg-neutral-500 min-h-[51px] tracking-[3.6px] w-[196px] ${buttonText === 'Next question' ? 'text-xl' : ''} hover:bg-[#7100AE]`}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Poll;
