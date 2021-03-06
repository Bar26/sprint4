import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { onSaveBoard, setCurrBoard } from '../../store/actions/board.actions'


export const ChangeBgcColorsModal = ({ menuShow, onToggleBoardMenu, setSelectedType, setTitle }) => {
    const { currBoard } = useSelector((state) => state.boardModule)
    const dispatch = useDispatch()

    const palette = [
        '#61bd4f',
        '#ff9f1a',
        '#eb5a46',
        '#c377e0',
        '#0079bf',
        '#00c2e0',
        '#51e898',
        '#ff78cb',
        '#344563',
        '#519839'
    ]

    const onChangeColorStyle = async (newStyle) => {
        console.log(newStyle)
        try {
            const newBoard = {...currBoard, style: { backgroundColor: newStyle }}
            await dispatch(onSaveBoard(newBoard))
            setSelectedType('main-board')
            setTitle('Menu')
            // await dispatch(setCurrBoard(newBoard))
        } catch {
            console.err();
        }
    }

    useEffect(() => {
        console.log('currBoard in store:', currBoard)
    }, [currBoard])

    return (
        <section className="colors-modal">
            {palette.map(color =>

                <div className="color-container" style={{ backgroundColor: color }} onClick={() => onChangeColorStyle(color)}></div>
            )}


        </section>
    )
}