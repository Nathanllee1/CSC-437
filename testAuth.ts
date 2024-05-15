async function main() {
    const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: "nathan6",
            password: "123"
        })
    })

    const { token } = await res.json() as { token: string }

    console.log(token)

    const login = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            username: "nathan3",
            password: "1243"
        })
    }
    )

    console.log(await login.json())
}

main()