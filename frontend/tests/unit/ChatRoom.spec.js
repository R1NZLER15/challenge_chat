import { mount } from '@vue/test-utils'
import ChatRoom from '@/components/ChatRoom.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('ChatRoom.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(ChatRoom)
    expect(wrapper.exists()).toBe(true)
  })

  it('sends a message when send button is clicked', async () => {
    const wrapper = mount(ChatRoom)
    await wrapper.setData({ username: 'testUser', message: 'Hello' })
    await wrapper.find('v-btn').trigger('click')
    // Assertions to check if the message was sent
  })
})
