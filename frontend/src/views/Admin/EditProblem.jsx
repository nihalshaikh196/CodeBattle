import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import MdEditor from 'react-markdown-editor-lite';
import AdminNavBar from '../../components/adminNavbar';
import PopupDialog from '../../components/Popup';
import useAdminServices from '../../services/adminServices';

function EditProblem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState({ timeLimit: '1s', memoryLimit: '256MB' });
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  
  const navigate = useNavigate();
  const { problemId } = useParams(); // Get the problem ID from the URL
  const { getProblem, updateProblem } = useAdminServices();

  const mdParser = {
    render: marked
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problem = await getProblem(problemId);
        // console.log(problem);
        if (problem) {
          setTitle(problem.title);
          setDescription(problem.description);
          setConstraints(problem.constraints);
          setTestCases(problem.testCases);
          setDifficulty(problem.difficulty);
          setTags(problem.tags);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        setPopupTitle('Error');
        setPopupMessage('Failed to fetch problem details');
        setIsPopupOpen(true);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = testCases.map((testCase, i) => {
      if (i === index) {
        return { ...testCase, [field]: value };
      }
      return testCase;
    });
    setTestCases(updatedTestCases);
  };

  const handleConstraintChange = (field, value) => {
    setConstraints(prev => ({ ...prev, [field]: value }));
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(' ')) {
      const newTag = value.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else {
      setTagInput(value);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProblem(problemId, { title, description, difficulty, testCases, tags, constraints });
    if (result.success) {
      setPopupTitle('Success');
      setPopupMessage('Problem updated successfully');
      setIsPopupOpen(true);
    } else {
      setPopupTitle('Error');
      setPopupMessage('Failed to update problem: ' + result.error);
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    if (popupTitle === 'Success') {
      navigate('/admin/home');
    }
  };

  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

   return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-white shadow">
          <AdminNavBar />
        </header>
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full space-y-8">
            <div className="bg-white shadow-xl rounded-2xl  overflow-hidden">
              <div className="px-6 py-8">
                <h1 className="text-3xl font-bold mb-6 text-purple-600 text-center">Edit Problem</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title of Problem
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <MdEditor
                      style={{ height: '400px', width: '100%' }}
                      renderHTML={(text) => mdParser.render(text)}
                      value={description}
                      onChange={handleEditorChange}
                      onImageUpload={handleImageUpload}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <div className="flex space-x-4">
                      {['Easy', 'Medium', 'Hard'].map((level) => (
                        <label key={level} className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-purple-600"
                            name="difficulty"
                            value={level}
                            checked={difficulty === level}
                            onChange={handleDifficultyChange}
                          />
                          <span className="ml-2">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                        Time Limit
                      </label>
                      <input
                        type="text"
                        id="timeLimit"
                        value={constraints.timeLimit}
                        onChange={(e) => handleConstraintChange('timeLimit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 1s"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="memoryLimit" className="block text-sm font-medium text-gray-700 mb-1">
                        Memory Limit
                      </label>
                      <input
                        type="text"
                        id="memoryLimit"
                        value={constraints.memoryLimit}
                        onChange={(e) => handleConstraintChange('memoryLimit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 256MB"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Test Cases</h3>
                    {testCases.map((testCase, index) => (
                      <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md">
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <label htmlFor={`input-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Input
                            </label>
                            <textarea
                              id={`input-${index}`}
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              rows="1"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor={`output-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Output
                            </label>
                            <textarea
                              id={`output-${index}`}
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              rows="1"
                              required
                            />
                          </div>
                        </div>
                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                    >
                      Add Test Case
                    </button>
                  </div>
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="Add tags separated by space"
                    />
                    <div className="mt-2 flex flex-wrap">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="mr-2 mb-2 px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full cursor-pointer"
                          onClick={() => handleTagRemove(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Edit Problem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <PopupDialog
          isOpen={isPopupOpen}
          closeModal={closePopup}
          popupMessage={popupMessage}
          title={popupTitle}
        />
      </div>
    );
}

export default EditProblem;