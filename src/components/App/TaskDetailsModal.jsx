import { useEffect, useState } from 'react'
import { FiDownload, FiPaperclip, FiSend, FiTrash2 } from 'react-icons/fi'

import { getApiErrorMessage } from '../../services/api'
import { taskService } from '../../services/taskService'
import { formatDate, formatEnum } from '../../utils/formatters'
import { Button } from '../ui/Button'
import { Modal } from './Modal'

export function TaskDetailsModal({ task, isOpen, onClose, onChanged, showToast }) {
  const [comments, setComments] = useState([])
  const [attachments, setAttachments] = useState([])
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!isOpen || !task?.id) {
      return
    }

    async function loadDetails() {
      setIsLoading(true)
      try {
        const [commentData, attachmentData] = await Promise.all([
          taskService.getComments(task.id),
          taskService.getAttachments(task.id),
        ])
        setComments(commentData)
        setAttachments(attachmentData)
      } catch (error) {
        showToast({ type: 'error', title: 'Task Details Error', message: getApiErrorMessage(error) })
      } finally {
        setIsLoading(false)
      }
    }

    loadDetails()
  }, [isOpen, showToast, task?.id])

  async function handleAddComment(event) {
    event.preventDefault()
    if (!comment.trim()) {
      return
    }

    try {
      const data = await taskService.createComment(task.id, { message: comment })
      setComments((currentComments) => [data, ...currentComments])
      setComment('')
      showToast({ type: 'success', title: 'Comment Added', message: 'Your comment was posted.' })
      onChanged()
    } catch (error) {
      showToast({ type: 'error', title: 'Comment Failed', message: getApiErrorMessage(error) })
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await taskService.deleteComment(commentId)
      setComments((currentComments) => currentComments.filter((item) => item.id !== commentId))
      showToast({ type: 'success', title: 'Comment Deleted', message: 'Comment removed.' })
      onChanged()
    } catch (error) {
      showToast({ type: 'error', title: 'Delete Failed', message: getApiErrorMessage(error) })
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const data = await taskService.uploadAttachment(task.id, file)
      setAttachments((currentAttachments) => [data, ...currentAttachments])
      showToast({ type: 'success', title: 'File Uploaded', message: 'File added to the task.' })
      onChanged()
    } catch (error) {
      showToast({ type: 'error', title: 'Upload Failed', message: getApiErrorMessage(error) })
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  async function handleDeleteAttachment(attachmentId) {
    try {
      await taskService.deleteAttachment(attachmentId)
      setAttachments((currentAttachments) => currentAttachments.filter((item) => item.id !== attachmentId))
      showToast({ type: 'success', title: 'Attachment Deleted', message: 'Attachment removed.' })
      onChanged()
    } catch (error) {
      showToast({ type: 'error', title: 'Delete Failed', message: getApiErrorMessage(error) })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task?.title || 'Task Details'} description="Review task context, discussion, and files.">
      {task && (
        <div className="grid gap-6">
          <section className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <Detail label="Priority" value={formatEnum(task.priority)} />
            <Detail label="Status" value={formatEnum(task.status)} />
            <Detail label="Deadline" value={formatDate(task.deadline)} />
            <Detail label="Assigned Member" value={task.assignedUserName || task.assignedTo || 'Unassigned'} />
          </section>

          <section>
            <h3 className="text-sm font-black uppercase text-slate-500 dark:text-slate-400">Description</h3>
            <p className="mt-2 rounded-lg bg-slate-100 p-4 text-sm leading-6 text-slate-700 dark:bg-white/5 dark:text-slate-200">{task.description || 'No description.'}</p>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">Comments</h3>
              {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500" />}
            </div>
            <form className="flex gap-2" onSubmit={handleAddComment}>
              <input className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment" />
              <Button type="submit" variant="accent" size="icon" aria-label="Add comment">
                <FiSend className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-4 grid gap-3">
              {comments.length ? comments.map((item) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{item.userName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.createdAt)}</p>
                    </div>
                    {item.ownComment && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteComment(item.id)} aria-label="Delete comment">
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.message}</p>
                </article>
              )) : <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">No comments yet.</p>}
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">Attachments</h3>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-teal-500/25">
                <FiPaperclip className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Attachment'}
                <input className="hidden" type="file" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div>
            <div className="grid gap-3">
              {attachments.length ? attachments.map((item) => (
                <article key={item.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{item.fileName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded by {item.uploadedBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="icon" aria-label="Download attachment">
                      <a href={`http://localhost:8081${item.fileUrl}`} download>
                        <FiDownload className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleDeleteAttachment(item.id)} aria-label="Delete attachment">
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </article>
              )) : <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">No attachments uploaded.</p>}
            </div>
          </section>
        </div>
      )}
    </Modal>
  )
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/5">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}
