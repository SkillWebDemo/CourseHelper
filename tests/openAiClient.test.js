const { sendQuestionToOpenAI } = require('../openAiClient');
const { OpenAIApi, Configuration } = require('openai');
const pdf = require('pdf-parse');

jest.mock('pdf-parse', () =>
  jest.fn(() => Promise.resolve({ text: 'Mocked PDF content' }))
);

jest.mock('openai', () => {
  const createChatCompletionMock = jest.fn();
  const OpenAIApiMock = jest.fn().mockImplementation(() => ({
    createChatCompletion: createChatCompletionMock,
  }));

  const ConfigurationMock = jest.fn().mockImplementation(() => ({}));

  return {
    OpenAIApi: OpenAIApiMock,
    Configuration: ConfigurationMock,
  };
});

describe('sendQuestionToOpenAI', () => {
  let createChatCompletionMock;

  beforeEach(() => {
    jest.clearAllMocks();
    const openaiInstance = new OpenAIApi();
    createChatCompletionMock = openaiInstance.createChatCompletion;
  });

  it('should return a response when given valid input', async () => {
    createChatCompletionMock.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: 'Test response from OpenAI.',
            },
          },
        ],
      },
    });

    const response = await sendQuestionToOpenAI('Test question');
    expect(response).toBe('Test response from OpenAI.');
    expect(createChatCompletionMock).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for invalid input', async () => {
    await expect(sendQuestionToOpenAI(null)).rejects.toThrow(
      "Invalid input: 'questionFromUser' must be a non-empty string."
    );
    expect(createChatCompletionMock).not.toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    createChatCompletionMock.mockRejectedValue(new Error('API Error'));

    await expect(sendQuestionToOpenAI('Test question')).rejects.toThrow(
      'Failed to communicate with OpenAI API.'
    );
    expect(createChatCompletionMock).toHaveBeenCalledTimes(1);
  });
});
