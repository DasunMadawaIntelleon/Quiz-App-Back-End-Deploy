
export type Role = 'ADMIN' | 'USER'; 

export interface Route {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
}

export type AccessiblePaths = {
    [key in Role]: Route[];
};

const basePath = process.env.API_BASE_PATH || '/quizapp/api/v1';

export const accessiblePaths: AccessiblePaths = {
    ADMIN: [
        //Auth
        { method: 'POST', path: basePath+'/login' },
        { method: 'POST', path: basePath+'/token' },
        { method: 'POST', path: basePath+'/logout' },
        //Question
        { method: 'GET', path: basePath+'/question' },
        { method: 'GET', path: basePath+'/question/getall/active' },
        { method: 'GET', path: basePath+'/question/:id' },
        { method: 'GET', path: basePath+'/question/attempts/:questionId' },
        { method: 'POST', path: basePath+'/question' },
        { method: 'PUT', path: basePath+'/question/:id' },
        { method: 'DELETE', path: basePath+'/question/:id' },
        { method: 'PUT', path: basePath+'/question/inactive/:id' },
        //Quiz
        { method: 'GET', path: basePath + "/quiz" },
        { method: 'GET', path: basePath + "/quiz/:id" },
        { method: 'GET', path: basePath + "/dates" },
        { method: 'GET', path: basePath + "/quiz/analyse/:id" },
        { method: 'POST', path: basePath + "/quiz" },
        { method: 'PUT', path: basePath + "/quiz/:id" },
        { method: 'DELETE', path: basePath + "/quiz/:id" },
        //QuizQuestion
        { method: 'GET', path: basePath + "/quizQuestion/:quizId" },
        { method: 'POST', path: basePath + "/quizQuestion" },
        { method: 'DELETE', path: basePath + "/quizQuestion" },
        //User
        { method: 'GET', path: basePath + '/user' }, 
        { method: 'GET', path: basePath + '/user/:username' },
        { method: 'GET', path: basePath + '/user/random/:number' }, 
        { method: 'POST', path: basePath + '/user' }, 
        { method: 'POST', path: basePath + '/user/random' },
        { method: 'PUT', path: basePath + '/user/:username' }, 
        { method: 'DELETE', path: basePath + '/user/:username' },
        //UserQuiz
        { method: 'GET', path: basePath + '/userQuiz/quiz/:quizId' },
        { method: 'GET', path: basePath + '/userQuiz/user/:username' }, 
        { method: 'POST', path: basePath + '/userQuiz' }, 
        { method: 'DELETE', path: basePath + '/userQuiz' },
        //User Answer
        { method: 'POST', path: basePath + '/userAnswer/answer'},
        //AnswerSheet
        { method: 'GET', path: basePath +'/answerSheet/individualResult/:username/:quizId' },
        { method: 'GET', path: basePath +'/answerSheet/getResultsByQuiz/:quizId' },
        { method: 'GET', path: basePath + '/answerSheet/getResultsByUser/:username' }, 
        { method: 'GET', path: basePath + '/answerSheet/latestResults' },
        { method: 'GET', path: basePath + '/answerSheet/getUserResult/:username/:quizId' },  
    ],
    USER: [
        { method: 'POST', path: basePath+'/login' },
        { method: 'POST', path: basePath+'/token' },
        { method: 'POST', path: basePath+'/logout' },
        { method: 'PUT', path: basePath + '/user/:username' }, 
        { method: 'POST', path: basePath + '/userAnswer/answer' },
        { method: 'GET', path: basePath + '/userQuiz/user/:username' },
        { method: 'GET', path: basePath + '/answerSheet/getUserResult/:username/:quizId' },
        { method: 'GET', path: basePath + "/quiz/:id" },
    ]
};

export const dirrectAccessRoutes = ['/quizapp/api/v1/auth/login', '/quizapp/api/v1/auth/logout'];