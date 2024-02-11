import { defineStore } from 'pinia';
import { computed, ref, reactive } from 'vue';

export const useAuth = defineStore('auth', () => {

    const token = ref();
    const refreshToken = ref();
    const userId = ref();
    const tenant = ref();
    let infoUser = reactive({});

    function setToken(tokenValue) {
        token.value = tokenValue;
    }

    function setRefreshToken(refreshTokenValue) {
        refreshToken.value = refreshTokenValue;
    }

    function setUserId(userIdValue) {
        userId.value = userIdValue;
    }

    function setTenant(tenantValue) {
        tenant.value = tenantValue;
    }

    function setInfoUser(infoUserValue) {
        infoUser.value = infoUserValue;
    }

    const isAuthenticated = computed(() => {
        return token.value && userId.value;
    })

    function logout() {
        localStorage.clear()
    }


    return {
        token,
        refreshToken,
        userId,
        tenant,
        infoUser,
        setToken,
        setRefreshToken,
        setUserId,
        setTenant,
        setInfoUser,
        isAuthenticated,
        logout
    }
},{
    persist: true,
    debug: true
  },
)  