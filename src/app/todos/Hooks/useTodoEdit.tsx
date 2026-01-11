import { Todo } from "@prisma/client";
import { useState } from "react"
import { editTodoAction } from "../action";
import toast from 'react-hot-toast';

// 보통 훅의 리턴 타입은 'Use' + '훅이름' + 'Return' 식으로 짓거나,
// 굳이 export 할 필요 없다면 추론에 맡기기도 합니다.
interface UseTodoEditReturn {
    editingId : string | null;
    editTitle : string;
    editDesc : string;
    setEditTitle : (title : string) => void;
    startEditing: (todo: Todo) => void;
    setEditDesc: (desc : string) => void;
    cancelEditing : () => void;
    saveEdit: () => Promise<void>;
};

const useTodoEdit = () : UseTodoEditReturn => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDesc, setEditDesc] = useState('');
    const [editTitle, setEditTitle] = useState('');

    const startEditing = (todo : Todo) => {
	    setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDesc(todo.description || '')
    }

    const cancelEditing = () => {
        setEditingId(null);
        setEditTitle('');
    }

    const saveEdit = async () => {
        if(!editingId) return;
        const titleToSave = editTitle.trim().length === 0 ? '제목 없음' : editTitle;
        const res = await editTodoAction(editingId, titleToSave, editDesc);
        if (res.success) {
                toast.success('저장에 성공했습니다.');
                setEditingId(null);
        } else toast.error(res.error);
    }

    return {
        editingId,
        editTitle,
        editDesc,
        setEditTitle,
        startEditing, 
        setEditDesc,
        cancelEditing,
        saveEdit
    }
}

export default useTodoEdit;