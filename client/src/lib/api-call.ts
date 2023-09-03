
export function handleApiErrors(response: Response, success: (response: Response) => any) {
    if(response.status >= 500){
        handleApiServerError(response);
    } else if(response.status >= 400) {
        handleApiRequestError(response)
    } else {
        success(response);
    }

}

function handleApiRequestError(response: Response) {
    console.warn(`[REQUEST-ERROR] Error ${response.status}: ${response.body}`);
    const statusCode: string = `status${response.status}`
    const messages: {[code: string]: string} = {
        status400: 'Bad Request. Please review provided data.',
        status401: 'Unauthorized. Please log in',
        status403: 'Forbidden. If you think this is an error, please ask your administrator',
        status404: 'Entity Not Found. Please ensure provided data correspond to a valid entity.',
        defaultMessage: 'Request error.'
    }
    alert(messages[statusCode] || messages.defaultMessage);
}

function handleApiServerError(response: Response) {
    console.error(`[SERVER-ERROR] Error ${response.status}: ${response.body}`);
    alert('Server Error. Please try again later.');
}