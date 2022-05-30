import { TaskPreview } from "./TaskPreview"
import React from "react"
import { boardService } from "../services/board.service"
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { setCurrBoard } from "../store/actions/board.actions"
import { useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { utilService } from "../services/util.service"
import { useEffectUpdate } from './useEffectUpdate'


export const GroupPreview = ({ group, board }) => {
    // console.log(group)
    const dispatch = useDispatch()
    const formRef = React.createRef()
    let onMount = useRef(true)
    const [newCardTitle, setNewCardTitle] = useState('')
    const inputRef = useRef()
    const addCardBtnRef = useRef()
    

    // useEffect(() => {
    //     console.log('in use effect')
    //     if (!onMount.current) onMount.current = false
    //     else onAddCard()
    // }, [])
    useEffectUpdate(() => {
        // console.log('in use effect update')
        // if (!onMount.current) onMount.current = false
        onAddCard()
    }, [newCardTitle])


    const onSubmit = (ev) => {
        console.log('in on submit')
        ev.preventDefault()
        const { value } = ev.target[0]
        setNewCardTitle(value)
        ev.target[0].value = ''

    }


    const onAddCard = () => {
        // if (!newCardTitle) return  ///////plaster???????????
        const groupIdx = board.groups.findIndex(_group => _group.id === group.id)
        // console.log(groupIdx)
        const updatedBoard = { ...board }
        boardService.createTask(newCardTitle)
            .then((task) => {
                updatedBoard.groups[groupIdx].tasks.push(task)
                return updatedBoard
            })
            .then(boardService.update)
            .then((board) => dispatch(setCurrBoard(board)))

    }
    const onCopyCard = (task) => {
        const updatedBoard = { ...board }
        boardService.copyTask(task)
            .then((task) => {
                console.log(task)
                const groupIdx = board.groups.findIndex(_group => _group.id === group.id)
                updatedBoard.groups[groupIdx].tasks.push(task)
                return updatedBoard
            })
            .then(boardService.update)
            .then((board) => dispatch(setCurrBoard(board)))
    }

    const toggleForm = () => {
        formRef.current.classList.toggle('close')
        inputRef.current.value = ''
        addCardBtnRef.current.classList.toggle('close')

    }

    const onRemoveCard = (taskId) => {
        const groupIdx = board.groups.findIndex(_group => _group.id === group.id)
        const taskIdx = board.groups[groupIdx].tasks.findIndex(_task => _task.id === taskId)
        // console.log(groupIdx)
        const updatedBoard = { ...board }
        boardService.removeTask(updatedBoard, groupIdx, taskIdx)
            .then(boardService.update)
            .then((board) => dispatch(setCurrBoard(board)))
    }



    // const handleChange = ({ target }) => {
    //     // const value = target.type === 'number' ? (+target.value || '') : target.value
    //     const value = target.value
    //     setNewCardTitle({value })
    // }

    const onMyDrop = (res,groupIdDest, groupIdSource) => {
        const groupDest = board.groups.find(_group => _group.id === groupIdDest)
        const groupSource = board.groups.find(_group => _group.id === groupIdSource)
        const taskToMove = groupSource.tasks.splice(res.source.index,1)
        const groupIdxDest = board.groups.findIndex(_group => _group.id === groupIdDest)
        const groupIdxSour = board.groups.findIndex(_group => _group.id === groupIdSource)
        groupDest.tasks.splice(res.destination.index,0,taskToMove[0])
        let newBoard = {...board}
        newBoard.groups.splice(groupIdxDest,1,groupDest)
        newBoard.groups.splice(groupIdxSour,1,groupSource)
        boardService.update(newBoard)
    }


    const handleOnDragEnd = (res) => {
        console.log(res)
        if (!res.destination) return;
        console.log("HRY BAR");
        onMyDrop(res,res.destination.droppableId, res.source.droppableId)
    }

    /////
    //TODO: ADD STYLE
    return <article className='group'>
        <header className='group-title'>
            {group.title}
        </header>
        
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={group.id}>
                {(provided) => {
                    return <div className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {group.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided) => {
                                    return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <TaskPreview onCopyCard={onCopyCard} onRemoveCard={onRemoveCard} index={index} group={group} task={task} key={task.id} />
                                    </div>
                                }}
                            </Draggable>
                        )
                        )}
                        {provided.placeholder}
                    </div>
                }}
            </Droppable>
        </DragDropContext>

        <div className="add-card-btn flex" onClick={toggleForm} ref={addCardBtnRef} ><span className="plus">+</span><button > Add a card </button></div>
        <form className="add-card-form close" onSubmit={onSubmit} ref={formRef}>
            <input ref={inputRef} name="card-title" type="text" placeholder="Enter a title for this card" />
            <button type="button" className="close-form" onClick={toggleForm}>X</button>
            <button className="save-card">Add card</button>
        </form>



    </article>
}