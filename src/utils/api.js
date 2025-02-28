const BASE_SERVER_URL = "https://smart-notes-be-production.up.railway.app";

export const fetchNotes = async () => {
    const res = await fetch(`${BASE_SERVER_URL}/notes`);
    if (!res.ok) {
        throw new Error('failed to fetch notes', res.statusText)
    }
    return res.json();
};


export const addNote = async (title, content) => {
    const res = await fetch(`${BASE_SERVER_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify({ title, content })
    });
    if (!res.ok) {
        throw new Error('failed to create note', res.statusText)
    } return res.json();
};


export const updateNote = async (id, title, content) => {
    const res = await fetch(`${BASE_SERVER_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify({ title, content })
    });


    if (!res.ok) {
        throw new Error('failed to update note', res.statusText)
    } return res.json();
};


export const deleteNote = async (id) => {
    const res = await fetch(`${BASE_SERVER_URL}/notes/${id}`, {
        method: 'DELETE',
    });


    if (!res.ok) {
        throw new Error('failed to delet note', res.statusText)
    } return res.json();
};

export const summariseNote = async (content) => {
    const res = await fetch(`${BASE_SERVER_URL}/notes/summarise`, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify({content})
    })
    const data = await res.json()
    return data.summary
}
