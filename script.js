document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("results");

    searchButton.addEventListener("click", async function() {
        const query = searchInput.value.trim();
        if (!query) {
            alert("❌✨ *الرجاء إدخال اسم الأغنية للبحث عنها!* ✨❌");
            return;
        }

        const apiURL = `https://iyaudah-iya.vercel.app/spotify/search?query=${encodeURIComponent(query)}`;

        try {
            resultsContainer.innerHTML = "<p>🔎✨ *جاري البحث عن الأغنية...* ✨🔎</p>";
            const response = await fetch(apiURL);

            if (!response.ok) throw new Error(`⚠️❌ *خطأ HTTP!* الحالة: ${response.status}`);

            const data = await response.json();

            if (data.length === 0) {
                resultsContainer.innerHTML = "<p>⚠️❌ *لم يتم العثور على نتائج.* ❌⚠️</p>";
                return;
            }

            resultsContainer.innerHTML = "";
            data.forEach((track) => {
                const trackElement = document.createElement("div");
                trackElement.classList.add("track");
                trackElement.innerHTML = `
                    <img src="${track.image}" alt="${track.name}" />
                    <div>
                        <p><strong>${track.name}</strong> - ${track.artists}</p>
                        <p>⏱️✨ *المدة:* ${track.duration}</p>
                        <b><a href="${track.link}" target="_blank">🌐 *عرض على سبوتيفاي*</a></b>
                        <div class="buttons">
                            <button class="play-button" onclick="playSong('${track.link}')">
                                ▶️✨ *تشغيل*
                            </button>
                            <button class="download-button" onclick="downloadSong('${track.link}')">
                                ⬇️✨ *تحميل*
                            </button>
                        </div>
                        <div id="spotify_player_${getSpotifyTrackId(track.link)}" style="margin-top:10px;"></div>
                    </div>
                `;
                resultsContainer.appendChild(trackElement);
            });
        } catch (error) {
            console.error("⚠️❌ *حدث خطأ أثناء البحث عن الأغنية:*", error);
            resultsContainer.innerHTML = "<p>⚠️❌ *حدث خطأ أثناء البحث، الرجاء المحاولة لاحقًا.* ❌⚠️</p>";
        }
    });
});

async function downloadSong(songUrl) {
    if (!songUrl) {
        alert("❌✨ *رابط الأغنية غير متوفر.* ✨❌");
        return;
    }
    
    const downloadApi = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(songUrl)}`;
    
    try {
        const response = await fetch(downloadApi);
        
        if (!response.ok) {
            throw new Error(`⚠️❌ *خطأ HTTP!* الحالة: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === true && data.download) {
            window.location.href = data.download;
        } else {
            alert("⚠️❌ *فشل في التحميل، الرجاء المحاولة لاحقًا.* ❌⚠️");
        }
    } catch (error) {
        console.error("⚠️❌ *حدث خطأ أثناء تحميل الأغنية:*", error);
        alert("⚠️❌ *حدث خطأ أثناء التحميل، الرجاء المحاولة لاحقًا.* ❌⚠️");
    }
}

function playSong(songUrl) {
    const trackId = getSpotifyTrackId(songUrl);
    const playerContainer = document.getElementById(`spotify_player_${trackId}`);

    if (!playerContainer) {
        console.error("⚠️❌ *تعذر العثور على حاوية المشغل.* ❌⚠️");
        return;
    }

    document.querySelectorAll("[id^='spotify_player_']").forEach(el => el.innerHTML = "");

    playerContainer.innerHTML = `
        <iframe src="https://open.spotify.com/embed/track/${trackId}" 
            width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media">
        </iframe>
    `;
}

function getSpotifyTrackId(url) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
}
