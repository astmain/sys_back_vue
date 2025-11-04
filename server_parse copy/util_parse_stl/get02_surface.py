from stl import mesh

from tool import tool


@tool.wrapper_time_func(title="方法:2表面积")
def get02_surface(self, vectors=None, curr_np=None):
    batch_size = 100000  # 每次处理100,000个三角形
    surface = 0
    num_triangles = vectors.shape[0] // 3  # 计算三角形的总数量
    for i in range(0, num_triangles, batch_size):
        batch_vertices = vectors[i: i + batch_size * 3].reshape(-1, 3, 3)
        edge1 = batch_vertices[:, 1] - batch_vertices[:, 0]
        edge2 = batch_vertices[:, 2] - batch_vertices[:, 0]
        cross_products = curr_np.cross(edge1, edge2)
        areas = curr_np.linalg.norm(cross_products, axis=1) / 2.0
        surface += curr_np.sum(areas)

    # 基础数据
    surface = float(surface)
    print('surface---:', surface)

    # 返回参数
    self.state['surface_area'] = float(surface)
