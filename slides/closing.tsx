"use client";

import { R } from "@/components/ui";

export function Closing() {
  return (
    <div className="closing-slide">
      <div className="closing-copy">
        <R className="closing-eyebrow">
          <span aria-hidden="true">◆</span> Амьдрал 3.0
        </R>
        <R>
          <h2 className="closing-title">
            Анхаарал <br />
            хандуулсанд <br />
            <em>баярлалаа</em>
          </h2>
        </R>
        <R className="closing-message">Ирээдүйг хамтдаа бүтээнэ.</R>
        <R className="closing-activity">
          <a href="/ajilbar" className="closing-link">
            <span>
              <small>Мэдлэгээ бататгая</small>
              <b>Үгийн сүлжээ бөглөх</b>
            </span>
            <span className="closing-link-arrow" aria-hidden="true">↗</span>
          </a>
          <span className="closing-shorturl">/ajilbar</span>
        </R>
      </div>
      <R className="closing-art">
        <img
          src="/img/closing-life3.png"
          alt="Дэлхийн дээгүүр гэрэлт бөмбөрцөг рүү тэмүүлэх хүний болон хиймэл оюуны гар"
          draggable={false}
        />
        <span className="closing-art-caption">Хүн · Оюун ухаан · Ирээдүй</span>
      </R>
    </div>
  );
}
