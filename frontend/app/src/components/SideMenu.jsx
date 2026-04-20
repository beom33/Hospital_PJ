import { Link, useLocation } from "react-router-dom";

export default function SideMenu() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
   
    {
      title: "공지사항",
      path: "/notice",
      subItems: [
        { title: "공지사항", path: "/notice" },
      ],
    },
    {
      title: "의료 정보",
      path: "/insurance",
      subItems: [
        { title: "보험적용확인", path: "/insurance" },
       
      ],
    },
  ];

  const isActive = (path) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <aside className="side-menu">
      {menuItems.map((menu, index) => (
        <div key={index} className="side-menu-section">
          <div className={`side-menu-title ${isActive(menu.path) ? "active" : ""}`}>
            {menu.title}
          </div>
          <ul className="side-menu-list">
            {menu.subItems.map((item, subIndex) => (
              <li key={subIndex} className={`side-menu-item ${currentPath === item.path ? "active" : ""}`}>
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
