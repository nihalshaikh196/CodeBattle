import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import ProblemNavBar from '../../components/problemNavBar';
import MonacoEditor from '@monaco-editor/react';
import Loader from '../../components/loader';
import useUserServices from '../../services/user';
import useCodeServices from '../../services/codeServices';

const Problem = () => {
  const { fetchProblemWithID } = useUserServices();
  const { problemId,contestId } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// Your code here');
  const [testCase, setTestCase] = useState('');
  const [testResult, setTestResult] = useState(''); // State for test result
  const [showTestCase, setShowTestCase] = useState(true); // State to toggle between test case and test result
  const [success, setSuccess] = useState(true);
  const { runCode,submitContest } = useCodeServices();

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

  useEffect(() => {
    setCode(getDefaultCode(language));
  }, []);

  if (!problem) {
    return <Loader />;
  }

  const handleSubmit = async () => {
    
      try {
        const response =await submitContest(code, language, problemId,contestId);
        // console.log(response.data);
        if (response) {
          if (response.data.success) {
            setTestResult("All test cases passed successfully.");
            setSuccess(true);
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
    <div className="flex flex-col h-screen">
      <ProblemNavBar ProblemName={problem.title} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 bg-gray-50 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Problem Description</h2>
          <div className="p-4">
            <div className="mt-2">
              {problem.tags.map((tag, index) => (
                <span key={index} className="inline-block mr-2 px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className={`mt-4 text-lg font-bold ${problem.difficulty === 'Easy' ? 'text-green-500' : problem.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              Difficulty: {problem.difficulty}
            </div>
            <div className="mt-6">
              <div className="prose" dangerouslySetInnerHTML={{ __html: marked(problem.description) }} />
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          <div className="flex-1 bg-white border border-gray-300 overflow-auto">
            <h2 className="text-xl font-bold p-2 border-b">Code Editor</h2>
            <div className="p-2">
              <label className="block mb-2">
                Select Language:
                <select value={language} onChange={handleLanguageChange} className="ml-2 p-1 border w-28 rounded-lg">
                  <option value="js">JavaScript</option>
                  <option value="py">Python</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </label>
              <MonacoEditor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  minimap: { enabled: false },
                }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-300 overflow-auto h-56">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-2">
                <button onClick={() => setShowTestCase(true)} className={`px-4 py-2 rounded ${showTestCase ? 'bg-purple-400 text-white' : 'bg-gray-100'}`}>Test Cases</button>
                <button onClick={() => setShowTestCase(false)} className={`px-4 py-2 rounded ${!showTestCase ? 'bg-purple-400 text-white' : 'bg-gray-100'}`}>Test Result</button>
              </div>
              <div className="flex space-x-2">
                <button onClick={runTestCase} className="bg-purple-500 text-white px-4 py-2 rounded">Run</button>
                <button onClick={handleSubmit} className="bg-green-400 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </div>
            {showTestCase ? (
              <textarea value={testCase}
                onChange={(e) => setTestCase(e.target.value)}
                className="w-full h-32 p-2 mb-2 border border-gray-300" 
                placeholder="Enter your test cases...">
              </textarea>
            ) : (
              success ? (
                <textarea value={testResult}
                  readOnly
                  className="w-full h-32 p-2 mb-2 border border-gray-300" 
                  placeholder="Output will be shown here...">
                </textarea>
              ) : (
                <pre
                  dangerouslySetInnerHTML={{ __html: testResult.replace(/\n/g, '<br>') }}
                  className="text-sm w-full h-32 p-2 mb-2 bg-white border border-gray-300 min-h-[100px] overflow-auto whitespace-pre-wrap"
                ></pre>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;