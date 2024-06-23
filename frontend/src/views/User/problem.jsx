import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
import ProblemNavBar from '../../components/problemNavBar';
import  MonacoEditor  from '@monaco-editor/react';
import Loader from '../../components/loader';
const Problem = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('// Your code here');

  useEffect(() => {
    fetch(`http://localhost:3000/admin/problems/${problemId}`)
      .then(response => response.json())
      .then(data => setProblem(data))
      .catch(error => console.error('Error fetching problem:', error));
  }, [problemId]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(getDefaultCode(e.target.value));
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'javascript':
        return '// JavaScript code here\n\nfunction solution() {\n  // Your code here\n}\n';
      case 'python':
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
    return <Loader/>;
  }

  return (
    <div className="flex flex-col h-screen">
      <ProblemNavBar ProblemName={problem.title} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 p-4 bg-gray-100 overflow-auto">
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
                <select value={language} onChange={handleLanguageChange} className="ml-2 p-1 border rounded-lg">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
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

          <div className="p-4 bg-gray-50 border-t border-gray-300 overflow-auto">
            <h2 className="text-lg font-bold mb-2">Test Cases</h2>
            <textarea className="w-full p-2 mb-2 border border-gray-300" placeholder="Enter your test cases..."></textarea>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Run</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
