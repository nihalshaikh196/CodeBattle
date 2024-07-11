import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import ProblemNavBar from '../../components/problemNavBar';
import MonacoEditor from '@monaco-editor/react';
import Loader from '../../components/loader';
import useUserServices from '../../services/user';
import useCodeServices from '../../services/codeServices';
import PopupDialog from "../../components/Popup";
import { CodeBracketIcon, PlayIcon, CheckIcon, BeakerIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const Problem = () => {
  const { fetchProblemWithID } = useUserServices();
  const { problemId} = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// Your code here');
  const [testCase, setTestCase] = useState('');
  const [testResult, setTestResult] = useState(''); // State for test result
  const [showTestCase, setShowTestCase] = useState(true); // State to toggle between test case and test result
  const [success, setSuccess] = useState(true);
  const { runCode,submitPractice } = useCodeServices();
  const [isOpen, setIsOpen] = useState(false);
  const [editorHeight, setEditorHeight] = useState('600px');

  useEffect(() => {
    const getProblem = async () => {
      try {
        const response = await fetchProblemWithID({ problemId });
        setProblem(response);
      } catch (error) {
        console.log(error);
      }
    };
    getProblem();
  }, [problemId]);

  // const handleResize = (e) => {
  //   const newHeight = e.clientY - e.target.getBoundingClientRect().top;
  //   setEditorHeight(`${newHeight}px`);
  // };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(getDefaultCode(e.target.value));
  };

  const runTestCase = async () => {
    const response = await runCode(code, language, testCase);
    const result = response.data.result;
    setSuccess(result.success);
    if (result.success) {
      setTestResult(result.output);
    } else {
      const formattedResult = [
        result.errors ? `<span style="color: red;">${result.errors}</span>` : '',
        result.warnings ? `<span style="color:rgb(250 204 21);">${result.warnings}</span>` : ''
      ].filter(Boolean).join('\n');
      setTestResult(formattedResult);
    }
    setShowTestCase(false);
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'js':
        return '// JavaScript code here\n\nfunction solution() {\n  // Your code here\n}\n';
      case 'py':
        return '# Python code here\n\ndef solution():\n    # Your code here\n    pass\n';
      case 'c':
        return '// C code here\n\n#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}\n';
      case 'cpp':
        return '// C++ code here\n\n#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}\n';
      case 'java':
        return '// Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n';
      default:
        return '// Your code here';
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setCode(getDefaultCode(language));
  }, []);

  if (!problem) {
    return <Loader />;
  }

  const handleSubmit = async () => {
    
      try {
        const response=await submitPractice(code, language, problemId);
        // console.log(response.data);
        if (response) {
            if (response.data.success) {
              setTestResult("All test cases passed successfully.");
              setSuccess(true);
              setIsOpen(true);
            } else {
            if(response.data.message ==="Execution error"){
              // console.log(response.data);
              const result = response.data.result;
              const formattedResult = [
                result.errors ? `<span style="color: red;">${result.errors}</span>` : '',
                result.warnings ? `<span style="color:rgb(250 204 21);">${result.warnings}</span>` : ''
              ].filter(Boolean).join('\n');
              setTestResult(formattedResult);
            }
            else{
            //  console.log(response.data);
             const failedTests = response.data.results.filter(result => !result.passed);
              const testResultMessage = failedTests.map(test => 
                `<span style="color: red;">Test case failed.</span>\nInput: ${test.input}\nExpected Output: ${test.expectedOutput}\nActual Output: ${test.actualOutput}`
              ).join('\n\n');
              setTestResult(testResultMessage);
              setSuccess(false);
            }
            setShowTestCase(false);
           } 
           
        } else {
          setTestResult(response.error || "An error occurred while submitting the code.");
          setSuccess(false);
          setShowTestCase(false);
        }
      } catch (error) {
        console.error("Error submitting practice:", error);
        setTestResult("An error occurred while submitting the practice.");
        setSuccess(false);
        setShowTestCase(false);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ProblemNavBar ProblemName={problem.title} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg h-full overflow-auto">
            <h2 className="text-2xl font-bold p-4 border-b bg-purple-100 text-purple-800 sticky top-0">Problem Description</h2>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className={`mb-6 text-lg font-bold ${
                problem.difficulty === 'Easy' ? 'text-green-600' : 
                problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                Difficulty: {problem.difficulty}
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(problem.description) }} />
            </div>
          </div>
        </div>

        <div className="w-3/5 p-4 flex flex-col">
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold p-4 bg-purple-100 text-purple-800 flex items-center">
              <CodeBracketIcon className="w-6 h-6 mr-2" /> Code Editor
            </h2>
            <div className="flex items-center p-2 bg-gray-50">
              <label className="flex ml-5 items-center">
                <span className="mr-2 font-medium">Select Language:</span>
                <select 
                  value={language} 
                  onChange={handleLanguageChange} 
                  className="p-1 w-28 border rounded-lg bg-purple-50 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {/* <option value="js">JavaScript</option>
                  <option value="py">Python</option>
                  <option value="c">C</option> */}
                  <option value="cpp">C++</option>
                  {/* <option value="java">Java</option> */}
                </select>
              </label>
            </div>
            <div className="flex-1 flex flex-col">
              <MonacoEditor
                height={editorHeight}
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
              <div 
                className="h-2 bg-gray-800 cursor-row-resize" 
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = parseInt(editorHeight);
                  const onMouseMove = (moveEvent) => {
                    const newHeight = startHeight + moveEvent.clientY - startY;
                    setEditorHeight(`${newHeight}px`);
                  };
                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                  };
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
              />
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-purple-100">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowTestCase(true)} 
                  className={`px-4 py-2 rounded-lg flex items-center ${showTestCase ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
                  title="Switch to Test Cases"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" /> Test Cases
                </button>
                <button 
                  onClick={() => setShowTestCase(false)} 
                  className={`px-4 py-2 rounded-lg flex items-center ${!showTestCase ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
                  title="Switch to Test Result"
                >
                  <BeakerIcon className="w-5 h-5 mr-2" /> Test Result
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={runTestCase} 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                  title="Run your code"
                >
                  <PlayIcon className="w-5 h-5 mr-2" /> Run
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                  title="Submit your solution"
                >
                  <CheckIcon className="w-5 h-5 mr-2" /> Submit
                </button>
              </div>
            </div>
            <div className="p-4">
              {showTestCase ? (
                <textarea 
                  value={testCase}
                  onChange={(e) => setTestCase(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Enter your test cases..."
                />
              ) : (
                success ? (
                  <textarea 
                    value={testResult}
                    readOnly
                    className="w-full h-32 p-2 border border-gray-300 rounded-lg bg-green-50 text-green-800" 
                    placeholder="Output will be shown here..."
                  />
                ) : (
                  <pre
                    dangerouslySetInnerHTML={{ __html: testResult.replace(/\n/g, '<br>') }}
                    className="w-full h-32 p-2 border border-gray-300 rounded-lg bg-red-50 text-red-800 overflow-auto whitespace-pre-wrap"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <PopupDialog
        isOpen={isOpen}
        closeModal={closeModal}
        popupMessage={"All test cases passed successfully."}
        title={"Accepted!!!"}
      />
    </div>
  );
};

export default Problem;