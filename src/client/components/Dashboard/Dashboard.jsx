import React, { Component } from 'react'
import { object, func } from 'prop-types'
import dbLogic from './logic'
import AddTodoForm from './AddTodoForm'
import EditTodoForm from './EditTodoForm'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todoInput: '',
      error: '',
      loading: false,
      todos: [],
      editingTodos: {},
      addTodoFormOpen: false
    }

    this.handleSetTodos = this.handleSetTodos.bind(this)
    this.handleToggleTodo = this.handleToggleTodo.bind(this)
    this.handleToggleEditTodo = this.handleToggleEditTodo.bind(this)
    this.handleDeleteTodo = this.handleDeleteTodo.bind(this)
  }

  async componentWillMount() {
    const result = await dbLogic.getTodos()
    this.setState({ todos: result.todos })
  }

  handleSetTodos(todos) {
    this.setState({ todos })
  }

  async handleToggleTodo(todo) {
    const result = await dbLogic.toggleTodo(todo)
    this.setState({ todos: result.todos })
  }

  handleToggleEditTodo(event, todo) {
    event.preventDefault()
    if (todo.record.completed) return
    const { editingTodos } = this.state
    editingTodos[todo['sequence-no']] = !editingTodos[todo['sequence-no']]
    this.setState({ editingTodos })
  }

  async handleDeleteTodo(event, todo) {
    event.preventDefault()

    await this.setState({ loading: true, error: undefined })

    const result = await dbLogic.deleteTodo(todo)

    if (result.error) this.setState({ error: result.error, loading: false })
    else this.handleSetTodos(result.todos)
  }

  render() {
    const {
      todos,
      editingTodos
    } = this.state

    return (
      <div className='container max-w-md font-bold bg-white p-8 shadow-md'>
        <div>
          {todos && todos.length !== 0 && todos.map((todo) => {
            return todo.command !== 'Delete'
              ? (
                <div
                  className={editingTodos[todo['sequence-no']] ?
                    'cursor-default relative container group' :
                    'cursor-pointer relative hover:bg-yellow-200 rounded container group'}
                  key={todo['sequence-no']}
                >

                  {editingTodos[todo['sequence-no']]

                    ? <EditTodoForm
                      handleToggleEditTodo={this.handleToggleEditTodo}
                      handleSetTodos={this.handleSetTodos}
                      todo={todo}
                    />

                    :
                    <div className='py-2 container flex'>
                      <div
                        className={todo.record.completed ? 'checkbox-checked fa-check' : 'checkbox fa-check-empty'}
                        onClick={() => this.handleToggleTodo(todo)}
                      />
                      <div
                        className={todo.record.completed ?
                          'inline-block ml-2 font-semibold line-through text-gray-600 flex-1' :
                          'inline-block ml-2 font-semibold flex-1'}
                        onClick={(e) => this.handleToggleEditTodo(e, todo)}
                      >
                        {todo.record.todo}
                      </div>
                      <div
                        className='fas fa-trash-alt absolute inset-y-0 right-0 mr-2 rounded-lg pt-2 pb-2 bg-transparent font-normal text-yellow-700 invisible group-hover:visible'
                        onClick={(e) => this.handleDeleteTodo(e, todo)}
                      />
                    </div>
                  }

                </div>
              )
              : null
          })}

          <div>
            <hr className='border border-t-0 border-gray-400 mt-4 mb-4' />
            <AddTodoForm handleSetTodos={this.handleSetTodos} />
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: object,
  handleRemoveUserAuthentication: func
}

export default Dashboard