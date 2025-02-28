import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/app/page';
import * as api from '../src/utils/api';
import '@testing-library/jest-dom';


jest.mock('../src/utils/api', () => ({
    fetchNotes: jest.fn() as jest.Mock<any, any[]>,
    addNote: jest.fn() as jest.Mock<any, any[]>,
    updateNote: jest.fn() as jest.Mock<any, any[]>,
    deleteNote: jest.fn() as jest.Mock<any, any[]>,
    summariseNote: jest.fn() as jest.Mock<any, any[]>,
}));

describe('Home Component', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('should fetch and display notes on mount', async () => {
        const mockNotes = [
            { id: 1, title: 'Test Note 1', content: 'Test Content 1' },
            { id: 2, title: 'Test Note 2', content: 'Test Content 2' },
        ];

        (api.fetchNotes as jest.Mock).mockResolvedValue(mockNotes);

        render(<Home />);

        await waitFor(() => screen.getByText('Test Note 1'));
        expect(screen.getByText('Test Note 1')).toBeInTheDocument();
        expect(screen.getByText('Test Note 2')).toBeInTheDocument();
    });

    test('should add a new note when create note button is clicked', async () => {
        (api.addNote as jest.Mock).mockResolvedValue({});
        (api.fetchNotes as jest.Mock).mockResolvedValue([
            { id: 1, title: 'Test Note 1', content: 'Test Content 1' },
        ]);

        render(<Home />);

        fireEvent.change(screen.getByPlaceholderText('Note title'), { target: { value: 'New Note' } });
        fireEvent.change(screen.getByPlaceholderText('Note content'), { target: { value: 'New Content' } });

        fireEvent.click(screen.getByText('Create Note'));

        // Wait for the notes list to be updated
        await waitFor(() => screen.getByText('New Note'));

        expect(screen.getByText('New Note')).toBeInTheDocument();
        expect(api.addNote).toHaveBeenCalledWith('New Note', 'New Content');
        expect(api.fetchNotes).toHaveBeenCalled();
    });

    test('should update a note when update button is clicked', async () => {
        (api.updateNote as jest.Mock).mockResolvedValue({});
        (api.fetchNotes as jest.Mock).mockResolvedValue([
            { id: 1, title: 'Updated Note', content: 'Updated Content' },
        ]);

        render(<Home />);

        fireEvent.change(screen.getByPlaceholderText('Note title'), { target: { value: 'Updated Note' } });
        fireEvent.change(screen.getByPlaceholderText('Note content'), { target: { value: 'Updated Content' } });

        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);

        await waitFor(() => screen.getByText('Updated Note'));

        expect(api.updateNote).toHaveBeenCalledWith(1, 'Updated Note', 'Updated Content');
        expect(api.fetchNotes).toHaveBeenCalled();
    });

    test('should delete a note when delete button is clicked', async () => {
        (api.deleteNote as jest.Mock).mockResolvedValue({});
        (api.fetchNotes as jest.Mock).mockResolvedValue([]);

        render(<Home />);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        await waitFor(() => expect(api.deleteNote).toHaveBeenCalledWith(1));
        expect(api.fetchNotes).toHaveBeenCalled();
    });

    test('should summarize note content when summarize button is clicked', async () => {
        const mockSummary = 'This is a summary of the note content';

        (api.summariseNote as jest.Mock).mockResolvedValue(mockSummary);

        render(<Home />);

        const summarizeButton = screen.getByText('summarise (AI)');
        fireEvent.click(summarizeButton);

        await waitFor(() => expect(api.summariseNote).toHaveBeenCalled());
        expect(window.alert).toHaveBeenCalledWith(mockSummary);
    });

    test('should handle errors in API calls gracefully', async () => {
        (api.fetchNotes as jest.Mock).mockRejectedValue(new Error('Failed to fetch notes'));

        render(<Home />);

        await waitFor(() => screen.getByText('Failed to fetch notes'));

    });
});
